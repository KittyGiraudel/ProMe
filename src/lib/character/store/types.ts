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

export type SyncedCharacterStore = CharacterStore & {
  /** Sets authenticated state and runs the initial bidirectional merge sync. */
  login(): Promise<void>
  /** Sets authenticated state to false. Local is already current; no sync needed. */
  logout(): void
  /** Syncs local and remote stores. Called on reconnect by useNetworkStatus. */
  syncToRemote(): Promise<void>
}
