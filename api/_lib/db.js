import { neon } from '@neondatabase/serverless';

function connectionString(){
  if(!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  return process.env.DATABASE_URL;
}

export function database(){ return neon(connectionString()); }

export async function ensureSchema(){
  const sql=database();
  await sql`CREATE TABLE IF NOT EXISTS waitlist_entries (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT NOT NULL,
    consent BOOLEAN NOT NULL DEFAULT TRUE,
    source TEXT NOT NULL,
    submitted_at TEXT,
    page TEXT
  )`;
  await sql`CREATE INDEX IF NOT EXISTS waitlist_entries_expires_idx ON waitlist_entries(expires_at)`;
  return sql;
}

export async function purgeExpired(sql){
  const result=await sql`DELETE FROM waitlist_entries WHERE expires_at <= NOW() RETURNING id`;
  return result.length;
}
