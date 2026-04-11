import { createLocalStorageCharacterStore } from '@/lib/character/store/localStorageStore'
import type { CharacterStore } from '@/lib/character/store/types'

let currentStore: CharacterStore = createLocalStorageCharacterStore()

export function getCharacterStore(): CharacterStore {
  return currentStore
}

export function setCharacterStore(store: CharacterStore): void {
  currentStore = store
}
