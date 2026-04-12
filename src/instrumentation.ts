/**
 * Runs once at server startup (every cold start in serverless environments).
 * CREATE TABLE IF NOT EXISTS is idempotent so this is safe to call repeatedly.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initDatabase } = await import('@/lib/db/schema')
    await initDatabase()
  }
}
