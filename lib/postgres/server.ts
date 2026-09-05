import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured.');
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSL === 'false' ? false : { rejectUnauthorized: false },
    });
  }

  return pool;
}

export async function query<Row = Record<string, unknown>>(text: string, values: unknown[] = []) {
  return getPool().query<Row>(text, values);
}
