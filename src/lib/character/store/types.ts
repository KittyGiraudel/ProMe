import type { Character, CharacterInput } from '@/lib/character/types'

export type CharacterStore = {
  list(): Promise<Character[]>
  get(id: string): Promise<Character | null>
  create(input?: Partial<CharacterInput>): Promise<Character>
  save(character: Character): Promise<Character>
  delete(id: string): Promise<boolean>
  export(id: string): Promise<string>
  import(json: string): Promise<Character>
}
