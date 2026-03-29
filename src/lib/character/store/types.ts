import type {
  Character,
  CharacterImportMode,
  CharacterImportResult,
  CharacterInput,
} from '@/lib/character/types'

export type CharacterStore = {
  list(): Character[]
  get(id: string): Character | null
  create(input?: Partial<CharacterInput>): Character
  save(character: Character): Character
  delete(id: string): boolean
  exportAll(): string
  importAll(json: string, mode?: CharacterImportMode): CharacterImportResult
}
