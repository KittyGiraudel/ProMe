import { getUser } from '@netlify/identity'
import { normalizeCharacter } from '@/lib/character/model'
import type { Character } from '@/lib/character/types'
import { sql } from '@/lib/db/client'

// GET /api/characters — list all characters for the authenticated user
export async function GET(_: Request): Promise<Response> {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await sql`
    SELECT data FROM characters
    WHERE user_id = ${user.id}
    ORDER BY data->>'updatedAt' DESC
  `

  const characters = rows
    .map(row => normalizeCharacter(row.data as unknown))
    .filter((c): c is Character => c !== null)

  return Response.json(characters)
}

// POST /api/characters — create a new character
export async function POST(req: Request): Promise<Response> {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const character = normalizeCharacter(body)
  if (!character) {
    return Response.json(
      { error: 'Invalid character payload' },
      { status: 422 }
    )
  }

  await sql`
    INSERT INTO characters (id, user_id, data)
    VALUES (${character.id}, ${user.id}, ${JSON.stringify(character)})
    ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data
  `

  return Response.json(character, { status: 201 })
}
