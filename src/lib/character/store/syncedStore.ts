import type { CharacterStore } from '@/lib/character/store/types'
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
