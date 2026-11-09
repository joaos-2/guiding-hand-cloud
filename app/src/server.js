import express from 'express';
import helmet from 'helmet';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { register, metricsMiddleware } from './metrics.js';
import { api } from './routes/api.js';
import { initDb, healthCheck } from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '32kb' }));
app.use(metricsMiddleware);

app.use('/', express.static(join(__dirname, '..', 'public')));

app.use('/api', api);

app.get('/health', async (_req, res) => {
  try {
    await healthCheck();
    res.json({ status: 'ok', db: 'up' });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'down' });
  }
});

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use((err, _req, res, _next) => {
  console.error('Erro nao tratado:', err.message);
  res.status(500).json({ error: 'Erro interno' });
});

async function start() {
  try {
    await initDb();
    console.log('Banco inicializado.');
  } catch (err) {
    console.error('Falha ao inicializar o banco:', err.message);
  }
  app.listen(PORT, () => console.log(`Guiding Hand Cloud ouvindo na porta ${PORT}`));
}

start();

export default app;
