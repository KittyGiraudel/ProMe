import { createLocalStorageCharacterStore } from '@/lib/character/store/localStorageStore'
import { createRemoteCharacterStore } from '@/lib/character/store/remoteStore'
import type {
  CharacterStore,
  SyncedCharacterStore,
} from '@/lib/character/store/types'
import type { Character } from '@/lib/character/types'

/**
 * Merges two character stores bidirectionally.
 *
 * For each unique character ID across both stores:
 * - Exists only in local  → written to remote via save()
 * - Exists only in remote → written to local via import() (preserves updatedAt)
 * - Exists in both        → most recent updatedAt wins; winner is written to the other side
 * - Equal updatedAt       → no-op
 *
 * All writes are fired in parallel. Safe to re-run (idempotent).
 */
export async function sync(
  local: CharacterStore,
  remote: CharacterStore
): Promise<void> {
  const [localChars, remoteChars] = await Promise.all([
    local.getAll(),
    remote.getAll(),
  ])

  const localMap = new Map<string, Character>(localChars.map(c => [c.id, c]))
  const remoteMap = new Map<string, Character>(remoteChars.map(c => [c.id, c]))
  const allIds = new Set([...localMap.keys(), ...remoteMap.keys()])

  const toLocal: Character[] = []
  const toRemote: Character[] = []

  for (const id of allIds) {
    const localChar = localMap.get(id)
    const remoteChar = remoteMap.get(id)

    if (!localChar) {
      toLocal.push(remoteChar!)
    } else if (!remoteChar) {
      toRemote.push(localChar)
    } else if (localChar.updatedAt > remoteChar.updatedAt) {
      toRemote.push(localChar)
    } else if (remoteChar.updatedAt > localChar.updatedAt) {
      toLocal.push(remoteChar)
    }
    // Equal timestamps: no-op
  }

  await Promise.all([
    ...toLocal.map(c => local.import(JSON.stringify(c))),
    ...toRemote.map(c => remote.save(c)),
  ])
}

export function createSyncedCharacterStore(
  localStore: CharacterStore = createLocalStorageCharacterStore(),
  remoteStore: CharacterStore = createRemoteCharacterStore()
): SyncedCharacterStore {
  let isAuthenticated = false

  async function attemptRemote(fn: () => Promise<unknown>): Promise<void> {
    try {
      await fn()
    } catch {
      // Remote failures are swallowed silently. The local write already
      // succeeded, so data is safe. The next reconnect sync will retry.
    }
  }

  return {
    async getAll() {
      return isAuthenticated ? remoteStore.getAll() : localStore.getAll()
    },

    async list() {
      return isAuthenticated ? remoteStore.list() : localStore.list()
    },

    async get(id) {
      return isAuthenticated ? remoteStore.get(id) : localStore.get(id)
    },

    async create(input) {
      // Create locally first (generates id + timestamps), then push to remote.
      // Requires PUT /api/characters/:id to support upsert (create-if-not-exists).
      const character = await localStore.create(input)
      if (isAuthenticated) {
        await attemptRemote(() => remoteStore.save(character))
      }
      return character
    },

    async save(character) {
      // Local write is authoritative (touchCharacter runs here, setting updatedAt).
      // The touched version is then pushed to remote.
      const saved = await localStore.save(character)
      if (isAuthenticated) {
        await attemptRemote(() => remoteStore.save(saved))
      }
      return saved
    },

    async delete(id) {
      const result = await localStore.delete(id)
      if (isAuthenticated) {
        await attemptRemote(() => remoteStore.delete(id))
      }
      return result
    },

    async import(json) {
      const character = await localStore.import(json)
      if (isAuthenticated) {
        await attemptRemote(() => remoteStore.save(character))
      }
      return character
    },

    async login() {
      isAuthenticated = true
      await sync(localStore, remoteStore)
    },

    logout() {
      isAuthenticated = false
    },

    async syncToRemote() {
      if (!isAuthenticated) return
      await sync(localStore, remoteStore)
    },
  }
}
