import {
  createPlayerCharacter,
  normalizePlayerCharacter,
  touchPlayerCharacter,
  validatePlayerCharacterForPersistence,
} from '@/lib/playerCharacter/model'
import {
  mergeImportedCharacters,
  parsePlayerCharacters,
  stringifyPlayerCharacters,
} from '@/lib/playerCharacter/store/migrations'
import type { CharacterStore } from '@/lib/playerCharacter/store/types'
import type { CharacterImportMode, PlayerCharacter } from '@/lib/playerCharacter/types'

const STORAGE_KEY = 'lsdp:playerCharacters:v1'

function safeReadStorage(): string {
  if (typeof window === 'undefined') return '[]'
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? '[]'
  } catch {
    return '[]'
  }
}

function safeWriteStorage(characters: PlayerCharacter[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, stringifyPlayerCharacters(characters))
  } catch {
    // ignore write failures (private mode / quota)
  }
}

function readAll(): PlayerCharacter[] {
  return parsePlayerCharacters(safeReadStorage())
}

function writeAll(characters: PlayerCharacter[]): PlayerCharacter[] {
  const normalized = characters
    .map(normalizePlayerCharacter)
    .filter((item): item is PlayerCharacter => item !== null)
  safeWriteStorage(normalized)
  return normalized
}

export function createLocalStorageCharacterStore(): CharacterStore {
  return {
    list() {
      return readAll().toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    },
    get(id) {
      return readAll().find(character => character.id === id) ?? null
    },
    create(input) {
      const next = createPlayerCharacter(input)
      const all = readAll()
      all.push(next)
      writeAll(all)
      return next
    },
    save(character) {
      const normalized = normalizePlayerCharacter(character)
      if (!normalized) {
        throw new Error('Invalid player character payload')
      }

      const validation = validatePlayerCharacterForPersistence(normalized)
      if (!validation.ok) {
        throw new Error(validation.errors.join('; '))
      }

      const touched = touchPlayerCharacter(normalized)
      const all = readAll()
      const index = all.findIndex(item => item.id === touched.id)
      if (index >= 0) {
        all[index] = touched
      } else {
        all.push(touched)
      }
      writeAll(all)
      return touched
    },
    delete(id) {
      const all = readAll()
      const next = all.filter(character => character.id !== id)
      if (next.length === all.length) return false
      writeAll(next)
      return true
    },
    exportAll() {
      return stringifyPlayerCharacters(readAll())
    },
    importAll(json, mode: CharacterImportMode = 'upsert') {
      const imported = parsePlayerCharacters(json)
      const existing = readAll()
      const validImported: typeof imported = []
      let discarded = 0
      for (const pc of imported) {
        const validation = validatePlayerCharacterForPersistence(pc)
        if (validation.ok) validImported.push(pc)
        else discarded += 1
      }

      const merged = mergeImportedCharacters(existing, validImported, mode)
      const result = {
        ...merged.result,
        discarded: merged.result.discarded + discarded,
      }
      writeAll(merged.characters)
      return result
    },
  }
}
