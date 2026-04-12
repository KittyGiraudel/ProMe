import { getUser } from '@netlify/identity'
import { validateCharacterForPersistence } from '@/lib/character/model'
import { parseCharacter } from '@/lib/character/store/migrations'
import { sql } from '@/lib/db/client'

// POST /api/characters/import
// Body: { json: string }  — the raw JSON string of a single exported character
export async function POST(req: Request): Promise<Response> {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { json: string }
  try {
    body = await req.json()
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const character = parseCharacter(body.json)
  if (!character) {
    return Response.json({ error: 'INVALID_PAYLOAD' }, { status: 422 })
  }

  const validation = validateCharacterForPersistence(character)
  if (!validation.ok) {
    return Response.json(
      { error: 'VALIDATION_ERROR', details: validation.errors },
      { status: 422 }
    )
  }

  await sql`
    INSERT INTO characters (id, user_id, data, created_at, updated_at)
    VALUES (
      ${character.id},
      ${user.id},
      ${JSON.stringify(character)},
      ${character.createdAt},
      ${character.updatedAt}
    )
    ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
  `

  return Response.json(character)
}
