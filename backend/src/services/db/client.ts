import pg from 'pg';
import { config } from '../../config/index.js';

const { Pool } = pg;

export const pool = config.databaseUrl
  ? new Pool({
      connectionString: config.databaseUrl,
      ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
    })
  : null;

if (pool) {
  pool.on('error', (err: Error) => {
    console.error('[Database Pool Error]:', err.message);
  });
} else {
  console.warn('[Database Notice]: DATABASE_URL not provided. Operating in decoupled memory mode.');
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  if (!pool) {
    return [];
  }
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
}
