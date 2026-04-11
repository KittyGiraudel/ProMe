import type {
  Character,
  CharacterImportMode,
  CharacterImportResult,
  CharacterInput,
} from '@/lib/character/types'

export type CharacterStore = {
  list(): Promise<Character[]>
  get(id: string): Promise<Character | null>
  create(input?: Partial<CharacterInput>): Promise<Character>
  save(character: Character): Promise<Character>
  delete(id: string): Promise<boolean>
  exportAll(): Promise<string>
  importAll(
    json: string,
    mode?: CharacterImportMode
  ): Promise<CharacterImportResult>
}
