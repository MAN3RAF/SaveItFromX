import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../services/db/client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  if (!pool) {
    console.error('[Migration Error]: DATABASE_URL is not configured.');
    process.exit(1);
  }

  const migrationsDir = path.resolve(__dirname, '../../migrations');
  console.log(`[Migration] Reading migrations from: ${migrationsDir}`);

  try {
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter((f) => f.endsWith('.sql')).sort();

    const client = await pool.connect();
    try {
      console.log(`[Migration] Connected to database. Found ${sqlFiles.length} migration(s).`);

      for (const file of sqlFiles) {
        console.log(`[Migration] Running: ${file}...`);
        const filePath = path.join(migrationsDir, file);
        const sql = await fs.readFile(filePath, 'utf-8');
        await client.query(sql);
        console.log(`[Migration] Completed: ${file}`);
      }

      console.log('[Migration] All migrations executed successfully.');
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error('[Migration Failed]:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
