import { Router } from 'express';
import { query } from '../db.js';

export const api = Router();

const OBSTACLE_TYPES = new Set([
  'placa', 'poste', 'orelhao', 'lixeira', 'cacamba',
  'buraco', 'carro-na-calcada', 'galho', 'degrau', 'outro'
]);

function parseEvent(body) {
  const obstacle = String(body?.obstacle ?? '').trim().toLowerCase();
  const lat = Number(body?.lat);
  const lng = Number(body?.lng);

  if (!OBSTACLE_TYPES.has(obstacle)) {
    return { error: `obstacle invalido. Use um de: ${[...OBSTACLE_TYPES].join(', ')}` };
  }
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) return { error: 'lat invalida' };
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) return { error: 'lng invalida' };

  return { obstacle, lat: Number(lat.toFixed(4)), lng: Number(lng.toFixed(4)) };
}

api.post('/events', async (req, res, next) => {
  try {
    const parsed = parseEvent(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });
    const { obstacle, lat, lng } = parsed;

    await query(
      'INSERT INTO events (obstacle, lat, lng) VALUES ($1, $2, $3)',
      [obstacle, lat, lng]
    );

    const { rows } = await query(
      `INSERT INTO barriers (obstacle, lat, lng, confirmations, status)
       VALUES ($1, $2, $3, 1, 'pending')
       ON CONFLICT (obstacle, lat, lng) DO UPDATE
         SET confirmations = barriers.confirmations + 1,
             status = CASE WHEN barriers.confirmations + 1 >= 3 THEN 'confirmed' ELSE barriers.status END,
             updated_at = now()
       RETURNING id, obstacle, lat, lng, confirmations, status`,
      [obstacle, lat, lng]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    return next(err);
  }
});

api.get('/barriers', async (req, res, next) => {
  try {
    const status = String(req.query.status ?? 'confirmed');
    const allowed = ['pending', 'confirmed', 'resolved', 'all'];
    const filter = allowed.includes(status) ? status : 'confirmed';

    const { rows } = filter === 'all'
      ? await query('SELECT id, obstacle, lat, lng, confirmations, status, updated_at FROM barriers ORDER BY updated_at DESC LIMIT 500')
      : await query('SELECT id, obstacle, lat, lng, confirmations, status, updated_at FROM barriers WHERE status = $1 ORDER BY updated_at DESC LIMIT 500', [filter]);

    return res.json({ count: rows.length, barriers: rows });
  } catch (err) {
    return next(err);
  }
});

api.get('/route', async (req, res, next) => {
  try {
    const from = String(req.query.from ?? '').trim();
    const to = String(req.query.to ?? '').trim();
    if (!from || !to) return res.status(400).json({ error: 'Informe from e to' });

    const { rows } = await query(
      "SELECT obstacle, lat, lng FROM barriers WHERE status = 'confirmed' ORDER BY updated_at DESC LIMIT 20"
    );

    return res.json({
      from,
      to,
      steps: [
        `Saindo de ${from}`,
        'Siga em frente pela calcada',
        rows.length ? `Atencao: ${rows.length} barreira(s) conhecida(s) nesta regiao` : 'Nenhuma barreira conhecida no caminho',
        `Chegada em ${to}`
      ],
      knownBarriers: rows
    });
  } catch (err) {
    return next(err);
  }
});
