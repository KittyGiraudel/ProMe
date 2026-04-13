import { getUser } from '@netlify/identity'
import { normalizeCharacter } from '@/lib/character/model'
import type { Character } from '@/lib/character/types'
import { sql } from '@/lib/db/client'

// GET /api/characters — list all characters for the authenticated user
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_: Request): Promise<Response> {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = (await sql`
    SELECT data FROM characters
    WHERE user_id = ${user.id}
    ORDER BY data->>'updatedAt' DESC
  `) as Array<{ data: Character }>

  const characters = rows
    .map(row => normalizeCharacter(row.data))
    .filter((c): c is Character => c !== null)

  return Response.json(characters)
}

// POST /api/characters — create a new character
export async function POST(request: Request): Promise<Response> {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'Unsupported Media Type' }, { status: 415 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch (error) {
    console.error(error)
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
      WHERE characters.user_id = EXCLUDED.user_id
  `

  return Response.json(character, { status: 201 })
}
