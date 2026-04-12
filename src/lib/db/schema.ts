import { sql } from '@/lib/db/client'

/**
 * Creates the characters table if it doesn't already exist.
 * Call this once at application startup (e.g., in the DB init API route).
 */
export async function initDatabase(): Promise<void> {
  // @TODO: clarify why not relying on the native timestamps from Postgres
  await sql`
    CREATE TABLE IF NOT EXISTS characters (
      id         TEXT        PRIMARY KEY,
      user_id    TEXT        NOT NULL,
      data       JSONB       NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    CREATE INDEX IF NOT EXISTS characters_user_id_idx ON characters (user_id)
  `
}
