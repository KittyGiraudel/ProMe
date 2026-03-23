import type {
  CharacterImportMode,
  CharacterImportResult,
  PlayerCharacter,
  PlayerCharacterInput,
} from '@/lib/playerCharacter/types'

export type CharacterStore = {
  list(): PlayerCharacter[]
  get(id: string): PlayerCharacter | null
  create(input?: Partial<PlayerCharacterInput>): PlayerCharacter
  save(character: PlayerCharacter): PlayerCharacter
  delete(id: string): boolean
  exportAll(): string
  importAll(json: string, mode?: CharacterImportMode): CharacterImportResult
}
