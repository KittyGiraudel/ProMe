import { createLocalStorageCharacterStore } from '@/lib/playerCharacter/store/localStorageStore'
import type { CharacterStore } from '@/lib/playerCharacter/store/types'

let cachedStore: CharacterStore | null = null

export function getCharacterStore(): CharacterStore {
  if (!cachedStore) {
    cachedStore = createLocalStorageCharacterStore()
  }
  return cachedStore
}
