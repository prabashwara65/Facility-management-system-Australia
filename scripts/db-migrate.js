const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const args = new Set(process.argv.slice(2));
const rootDir = process.cwd();
const migrationsDir = path.join(rootDir, 'app', 'database', 'migrations');
const seedersDir = path.join(rootDir, 'app', 'database', 'seeders');

function loadLocalEnv() {
  const envPath = path.join(rootDir, '.env.local');
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;

    const index = trimmed.indexOf('=');
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadLocalEnv();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === 'false' ? false : { rejectUnauthorized: false },
});

function getSqlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((file) => file.endsWith('.sql'))
    .sort()
    .map((file) => path.join(dir, file));
}

async function runFiles(label, files) {
  if (!files.length) {
    console.log(`No ${label} files found.`);
    return;
  }

  for (const file of files) {
    console.log(`Applying ${label}: ${path.relative(rootDir, file)}`);
    const sql = fs.readFileSync(file, 'utf8');
    await pool.query(sql);
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required. Add your Railway Postgres connection string to .env.local or the shell environment.');
  }

  if (args.has('--seed')) {
    await runFiles('seeder', getSqlFiles(seedersDir));
    return;
  }

  if (args.has('--reset')) {
    await runFiles('migration', getSqlFiles(migrationsDir));
    await runFiles('seeder', getSqlFiles(seedersDir));
    return;
  }

  await runFiles('migration', getSqlFiles(migrationsDir));
  if (!args.has('--no-seed')) {
    await runFiles('seeder', getSqlFiles(seedersDir));
  }
}

main()
  .then(async () => {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    console.log('Tables:');
    result.rows.forEach((row) => console.log(`- ${row.table_name}`));
    await pool.end();
  })
  .catch(async (error) => {
    console.error('Migration failed:', error.message);
    await pool.end();
    process.exit(1);
  });
