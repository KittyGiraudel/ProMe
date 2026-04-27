import { getUser } from '@netlify/identity'
import { validateCharacterForPersistence } from '@/lib/character/model'
import { parseCharacter } from '@/lib/character/store/migrations'
import { sql } from '@/lib/db/client'
import { NO_STORE_HEADERS } from '@/lib/security/cacheControl'
import { enforceTrustedOrigin } from '@/lib/security/trustedOrigin'

// POST /api/characters/import
// Body: { json: string }  — the raw JSON string of a single exported character
export async function POST(request: Request): Promise<Response> {
  const originError = enforceTrustedOrigin(request)
  if (originError) return originError

  const user = await getUser()
  if (!user)
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401, headers: NO_STORE_HEADERS }
    )

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json(
      { error: 'Unsupported Media Type' },
      { status: 415, headers: NO_STORE_HEADERS }
    )
  }

  let body: { json: string }
  try {
    body = await request.json()
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: 'Invalid JSON' },
      { status: 400, headers: NO_STORE_HEADERS }
    )
  }

  const character = parseCharacter(body.json)
  if (!character) {
    return Response.json(
      { error: 'INVALID_PAYLOAD' },
      { status: 422, headers: NO_STORE_HEADERS }
    )
  }

  const validation = validateCharacterForPersistence(character)
  if (!validation.ok) {
    return Response.json(
      { error: 'VALIDATION_ERROR', details: validation.errors },
      { status: 422, headers: NO_STORE_HEADERS }
    )
  }

  await sql`
    INSERT INTO characters (id, user_id, data)
    VALUES (${character.id}, ${user.id}, ${JSON.stringify(character)})
    ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data
      WHERE characters.user_id = EXCLUDED.user_id
  `

  return Response.json(character, { headers: NO_STORE_HEADERS })
}
