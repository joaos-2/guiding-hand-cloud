import pg from 'pg';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000
});

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function initDb() {
  const sql = await readFile(join(__dirname, '..', 'db', 'init.sql'), 'utf8');
  await pool.query(sql);
}

export function query(text, params) {
  return pool.query(text, params);
}

export async function healthCheck() {
  await pool.query('SELECT 1');
  return true;
}

export default pool;
