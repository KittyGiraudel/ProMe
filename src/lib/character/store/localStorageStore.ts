import { canPersistCharacterUpdate } from '@/lib/character/lifeStatus'
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
import type { Character, CharacterImportMode } from '@/lib/character/types'
import { TranslationKey, TranslationParams } from '@/lib/types'

const STORAGE_KEY = 'prome:characters:v1'

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
      return Promise.resolve(
        readAll().toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      )
    },
    get(id) {
      return Promise.resolve(readAll().find(c => c.id === id) ?? null)
    },
    create(input) {
      const next = createCharacter(input)
      const all = readAll()
      all.push(next)
      writeAll(all)
      return Promise.resolve(next)
    },
    save(character) {
      const normalized = normalizeCharacter(character)
      if (!normalized) return Promise.reject(new SaveError('INVALID_PAYLOAD'))

      const all = readAll()
      const existing = all.find(item => item.id === normalized.id) ?? null

      if (!canPersistCharacterUpdate(existing, normalized)) {
        return Promise.reject(new SaveError('DEAD_CHARACTER'))
      }

      const validation = validateCharacterForPersistence(normalized)
      if (!validation.ok) {
        return Promise.reject(new ValidationErrorCollection(validation.errors))
      }

      const touched = touchCharacter(normalized)
      const index = all.findIndex(item => item.id === touched.id)

      if (index >= 0) all[index] = touched
      else all.push(touched)

      writeAll(all)
      return Promise.resolve(touched)
    },
    delete(id) {
      const all = readAll()
      const next = all.filter(character => character.id !== id)
      if (next.length === all.length) return Promise.resolve(false)
      writeAll(next)
      return Promise.resolve(true)
    },
    exportAll() {
      return Promise.resolve(stringifyCharacters(readAll()))
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
      return Promise.resolve(result)
    },
  }
}

export class SaveError extends Error {
  details: string | undefined
  constructor(message: string, details?: string) {
    super(message)
    this.name = 'SaveError'
    this.details = details
  }
}

export class ValidationErrorCollection extends SaveError {
  errors: ValidationError[]
  constructor(errors: ValidationError[]) {
    super('VALIDATION_ERROR')
    this.errors = errors
  }
}

export class ValidationError extends Error {
  key: TranslationKey
  params: TranslationParams
  constructor(message: TranslationKey, parameters?: TranslationParams) {
    super('VALIDATION_ERROR')
    this.name = 'ValidationSingleError'
    this.params = parameters
    this.key = message
  }
}
