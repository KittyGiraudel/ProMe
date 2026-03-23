import {
  normalizeImportMode,
  normalizePlayerCharacter,
} from '@/lib/playerCharacter/model'
import type {
  CharacterImportMode,
  CharacterImportResult,
  PlayerCharacter,
} from '@/lib/playerCharacter/types'

type PersistedEnvelope = {
  schemaVersion?: number
  characters?: unknown
}

export function parsePlayerCharacters(json: string): PlayerCharacter[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return []
  }

  const list = extractCharacterList(parsed)
  return list
    .map(normalizePlayerCharacter)
    .filter((item): item is PlayerCharacter => item !== null)
}

export function stringifyPlayerCharacters(
  characters: PlayerCharacter[],
): string {
  return JSON.stringify(
    {
      schemaVersion: 1,
      characters,
    },
    null,
    2,
  )
}

function extractCharacterList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  if (!value || typeof value !== 'object') return []
  const envelope = value as PersistedEnvelope
  if (Array.isArray(envelope.characters)) return envelope.characters
  return []
}

export function mergeImportedCharacters(
  existing: PlayerCharacter[],
  imported: PlayerCharacter[],
  mode: CharacterImportMode,
): { characters: PlayerCharacter[]; result: CharacterImportResult } {
  const normalizedMode = normalizeImportMode(mode)
  const totalRead = imported.length

  if (normalizedMode === 'replace') {
    return {
      characters: imported,
      result: {
        totalRead,
        created: imported.length,
        updated: 0,
        discarded: 0,
      },
    }
  }

  const byId = new Map(existing.map(character => [character.id, character]))
  let created = 0
  let updated = 0
  for (const character of imported) {
    if (byId.has(character.id)) {
      updated += 1
    } else {
      created += 1
    }
    byId.set(character.id, character)
  }

  return {
    characters: Array.from(byId.values()),
    result: {
      totalRead,
      created,
      updated,
      discarded: 0,
    },
  }
}
