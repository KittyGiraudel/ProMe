import { createLocalStorageCharacterStore } from '@/lib/character/store/localStorageStore'
import type { CharacterStore } from '@/lib/character/store/types'

let cachedStore: CharacterStore | null = null

export function getCharacterStore(): CharacterStore {
  if (!cachedStore) {
    cachedStore = createLocalStorageCharacterStore()
  }
  return cachedStore
}
