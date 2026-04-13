import { getUser } from '@netlify/identity'
import { canPersistCharacterUpdate } from '@/lib/character/lifeStatus'
import {
  normalizeCharacter,
  validateCharacterForPersistence,
} from '@/lib/character/model'
import { Character } from '@/lib/character/types'
import { sql } from '@/lib/db/client'

type Params = { params: Promise<{ id: string }> }

// GET /api/characters/[id]
export async function GET(
  _request: Request,
  { params }: Params
): Promise<Response> {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const rows = (await sql`
    SELECT data FROM characters
    WHERE id = ${id} AND user_id = ${user.id}
    LIMIT 1
  `) as Array<{ data: Character }>

  if (rows.length === 0) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  return Response.json(rows[0].data)
}

// PUT /api/characters/[id] — save / update a character
export async function PUT(
  request: Request,
  { params }: Params
): Promise<Response> {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'Unsupported Media Type' }, { status: 415 })
  }

  const { id } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const normalized = normalizeCharacter(body)
  if (!normalized || normalized.id !== id) {
    return Response.json(
      { error: 'Invalid character payload' },
      { status: 422 }
    )
  }

  // Fetch the existing character to enforce dead-freeze rules.
  const existingRows = (await sql`
    SELECT data FROM characters
    WHERE id = ${id} AND user_id = ${user.id}
    LIMIT 1
  `) as Array<{ data: Character }>
  const existing =
    existingRows.length > 0 ? normalizeCharacter(existingRows[0].data) : null

  if (!canPersistCharacterUpdate(existing, normalized)) {
    return Response.json({ error: 'DEAD_CHARACTER' }, { status: 409 })
  }

  const validation = validateCharacterForPersistence(normalized)
  if (!validation.ok) {
    return Response.json(
      { error: 'VALIDATION_ERROR', details: validation.errors },
      { status: 422 }
    )
  }

  await sql`
    INSERT INTO characters (id, user_id, data)
    VALUES (${normalized.id}, ${user.id}, ${JSON.stringify(normalized)})
    ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data
  `

  return Response.json(normalized)
}

// DELETE /api/characters/[id]
export async function DELETE(
  _request: Request,
  { params }: Params
): Promise<Response> {
  const user = await getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const result = (await sql`
    DELETE FROM characters
    WHERE id = ${id} AND user_id = ${user.id}
  `) as unknown as { rowCount?: number }

  const deleted = result.rowCount ?? 0
  if (deleted === 0) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  return new Response(null, { status: 204 })
}
