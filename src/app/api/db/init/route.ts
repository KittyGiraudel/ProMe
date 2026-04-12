import { getUser } from '@netlify/identity'
import { initDatabase } from '@/lib/db/schema'

export async function POST(req: Request): Promise<Response> {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  await initDatabase()
  return Response.json({ ok: true })
}
