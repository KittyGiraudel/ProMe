import {
  createCharacter,
  normalizeCharacter,
  touchCharacter,
  validateCharacterForPersistence,
} from '@/lib/character/model'
import {
  mergeImportedCharacters,
  parseCharacters,
  stringifyCharacters,
} from '@/lib/character/store/migrations'
import type { CharacterStore } from '@/lib/character/store/types'
import type { CharacterImportMode, Character } from '@/lib/character/types'

const STORAGE_KEY = 'lsdp:characters:v1'

function safeReadStorage(): string {
  if (typeof window === 'undefined') return '[]'
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? '[]'
  } catch {
    return '[]'
  }
}

function safeWriteStorage(characters: Character[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, stringifyCharacters(characters))
  } catch {
    // ignore write failures (private mode / quota)
  }
}

function readAll(): Character[] {
  return parseCharacters(safeReadStorage())
}

function writeAll(characters: Character[]): Character[] {
  const normalized = characters
    .map(normalizeCharacter)
    .filter((item): item is Character => item !== null)
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
      const next = createCharacter(input)
      const all = readAll()
      all.push(next)
      writeAll(all)
      return next
    },
    save(character) {
      const normalized = normalizeCharacter(character)
      if (!normalized) {
        throw new Error('Invalid character payload')
      }

      const validation = validateCharacterForPersistence(normalized)
      if (!validation.ok) {
        throw new Error(validation.errors.join('; '))
      }

      const touched = touchCharacter(normalized)
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
      return stringifyCharacters(readAll())
    },
    importAll(json, mode: CharacterImportMode = 'upsert') {
      const imported = parseCharacters(json)
      const existing = readAll()
      const validImported: typeof imported = []
      let discarded = 0
      for (const pc of imported) {
        const validation = validateCharacterForPersistence(pc)
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
