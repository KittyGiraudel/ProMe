import { canPersistCharacterUpdate } from '@/lib/character/lifeStatus'
import {
  createCharacter,
  normalizeCharacter,
  touchCharacter,
  validateCharacterForPersistence,
} from '@/lib/character/model'
import {
  parseCharacter,
  parseCharacters,
  stringifyCharacter,
  stringifyCharacters,
} from '@/lib/character/store/migrations'
import type { CharacterStore } from '@/lib/character/store/types'
import type { Character } from '@/lib/character/types'
import { TranslationKey, TranslationParams } from '@/lib/types'

const STORAGE_KEY = 'prome:characters:v1'

function readStorage(): string {
  if (typeof window === 'undefined') throw new Error('UNAVAILABLE_STORAGE')
  return window.localStorage.getItem(STORAGE_KEY) ?? '[]'
}

function writeStorage(characters: Character[]): void {
  if (typeof window === 'undefined') throw new Error('UNAVAILABLE_STORAGE')
  window.localStorage.setItem(STORAGE_KEY, stringifyCharacters(characters))
}

function readAll(): Character[] {
  return parseCharacters(readStorage())
}

function writeAll(characters: Character[]): Character[] {
  const normalized = characters
    .map(normalizeCharacter)
    .filter((item): item is Character => item !== null)
  writeStorage(normalized)
  return normalized
}

export function createLocalStorageCharacterStore(): CharacterStore {
  return {
    getAll() {
      return Promise.resolve(readAll())
    },

    async list() {
      const characters = await this.getAll()
      return characters.toSorted((a, b) =>
        b.updatedAt.localeCompare(a.updatedAt)
      )
    },

    async get(id) {
      const characters = await this.getAll()
      return characters.find(c => c.id === id) ?? null
    },

    async create(input) {
      const character = createCharacter(input)
      const characters = await this.getAll()
      characters.push(character)
      writeAll(characters)
      return character
    },

    async save(character) {
      const normalized = normalizeCharacter(character)
      if (!normalized) throw new SaveError('INVALID_PAYLOAD')

      const characters = await this.getAll()
      const existing =
        characters.find(character => character.id === normalized.id) ?? null

      if (!canPersistCharacterUpdate(existing, normalized)) {
        throw new SaveError('DEAD_CHARACTER')
      }

      const validation = validateCharacterForPersistence(normalized)
      if (!validation.ok) {
        throw new ValidationErrorCollection(validation.errors)
      }

      const touched = touchCharacter(normalized)
      const index = characters.findIndex(
        character => character.id === touched.id
      )

      if (index >= 0) characters[index] = touched
      else characters.push(touched)

      writeAll(characters)
      return touched
    },

    async delete(id) {
      const characters = await this.getAll()
      const next = characters.filter(character => character.id !== id)
      if (next.length === characters.length) return false
      writeAll(next)
      return true
    },

    async import(json) {
      const character = parseCharacter(json)
      if (!character) throw new Error('INVALID_PAYLOAD')

      const validation = validateCharacterForPersistence(character)
      if (!validation.ok) {
        throw new ValidationErrorCollection(validation.errors)
      }

      const characters = await this.getAll()
      const index = characters.findIndex(c => c.id === character.id)
      if (index >= 0) characters[index] = character
      else characters.push(character)
      writeAll(characters)
      return character
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
