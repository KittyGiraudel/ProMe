import { createSyncedCharacterStore } from '@/lib/character/store/syncedStore'
import type {
  CharacterStore,
  SyncedCharacterStore,
} from '@/lib/character/store/types'

/**
 * The single character store instance for the lifetime of the app.
 * Always a SyncedCharacterStore — behaves as a local-only store when
 * unauthenticated, and dual-writes to remote when authenticated.
 */
export const characterStore: SyncedCharacterStore = createSyncedCharacterStore()

/** Returns the active character store. Used by hooks and components. */
export function getCharacterStore(): CharacterStore {
  return characterStore
}
