import type { Character, CharacterInput } from '@/lib/character/types'

export type CharacterStore = {
  getAll(): Promise<Character[]>
  list(): Promise<Character[]>
  get(id: string): Promise<Character | null>
  create(input?: Partial<CharacterInput>): Promise<Character>
  save(character: Character): Promise<Character>
  delete(id: string): Promise<boolean>
  import(json: string): Promise<Character>
}
