import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth/server'
import { initDatabase } from '@/lib/db/schema'

export async function POST(req: Request): Promise<Response> {
  const user = await getAuthenticatedUser(req)
  if (!user) return unauthorizedResponse()

  await initDatabase()
  return Response.json({ ok: true })
}
