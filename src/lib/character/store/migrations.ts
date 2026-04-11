import { normalizeCharacter } from '@/lib/character/model'
import type { Character } from '@/lib/character/types'

type PersistedEnvelope = {
  schemaVersion?: number
  characters?: unknown
}

type ExportEnvelope = {
  schemaVersion?: number
  character?: unknown
}

export function parseCharacters(json: string): Character[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return []
  }

  const list = extractCharacterList(parsed)
  return list
    .map(normalizeCharacter)
    .filter((item): item is Character => item !== null)
}

export function stringifyCharacters(characters: Character[]): string {
  return JSON.stringify({ schemaVersion: 1, characters })
}

export function parseCharacter(json: string): Character | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return null
  }

  if (!parsed || typeof parsed !== 'object') return null
  const envelope = parsed as ExportEnvelope
  const raw = envelope.character
  return raw != null ? normalizeCharacter(raw) : null
}

export function stringifyCharacter(character: Character): string {
  return JSON.stringify({ schemaVersion: 1, character })
}

function extractCharacterList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  if (!value || typeof value !== 'object') return []
  const envelope = value as PersistedEnvelope
  if (Array.isArray(envelope.characters)) return envelope.characters
  return []
}
