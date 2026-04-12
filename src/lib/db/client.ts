import { neon } from '@netlify/neon'

// DATABASE_URL is set automatically by Netlify when Netlify DB is provisioned.
// Locally: `netlify dev` sets it via the CLI.
export const sql = neon()
