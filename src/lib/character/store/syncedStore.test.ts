import { describe, expect, it, vi } from 'vitest'
import {
  createSyncedCharacterStore,
  sync,
} from '@/lib/character/store/syncedStore'
import type { CharacterStore } from '@/lib/character/store/types'
import type { Character } from '@/lib/character/types'

function makeChar(id: string, updatedAt: string): Character {
  return {
    id,
    schemaVersion: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt,
    name: `Character ${id}`,
    archetype: 'warrior',
    honor: 0,
    inspiration: 0,
    money: 0,
    health: { current: 10, max: 10 },
    courage: { current: 10, max: 10 },
    stamina: { current: 10, max: 10 },
    clock: 0,
    map: { currentPosition: { q: 0, r: 0 }, cells: [] },
    inventory: [],
    spellbook: [],
    journalEntries: [],
    lifeStatus: 'alive',
  }
}

function makeStore(characters: Character[]): CharacterStore {
  const chars = [...characters]
  return {
    getAll: vi.fn(async () => chars),
    list: vi.fn(async () => chars),
    get: vi.fn(async id => chars.find(c => c.id === id) ?? null),
    create: vi.fn(),
    save: vi.fn(async c => {
      const idx = chars.findIndex(x => x.id === c.id)
      if (idx >= 0) chars[idx] = c
      else chars.push(c)
      return c
    }),
    delete: vi.fn(async () => true),
    import: vi.fn(async json => {
      const c = JSON.parse(json) as Character
      const idx = chars.findIndex(x => x.id === c.id)
      if (idx >= 0) chars[idx] = c
      else chars.push(c)
      return c
    }),
  }
}

describe('sync', () => {
  it('copies a character that only exists in local to remote', async () => {
    const local = makeStore([makeChar('a', '2026-01-02T00:00:00.000Z')])
    const remote = makeStore([])
    await sync(local, remote)
    expect(remote.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'a' })
    )
    expect(local.import).not.toHaveBeenCalled()
  })

  it('copies a character that only exists in remote to local', async () => {
    const local = makeStore([])
    const remote = makeStore([makeChar('b', '2026-01-02T00:00:00.000Z')])
    await sync(local, remote)
    expect(local.import).toHaveBeenCalledWith(
      expect.stringContaining('"id":"b"')
    )
    expect(remote.save).not.toHaveBeenCalled()
  })

  it('writes the local version to remote when local is more recent', async () => {
    const localChar = makeChar('c', '2026-01-03T00:00:00.000Z')
    const remoteChar = makeChar('c', '2026-01-01T00:00:00.000Z')
    const local = makeStore([localChar])
    const remote = makeStore([remoteChar])
    await sync(local, remote)
    expect(remote.save).toHaveBeenCalledWith(localChar)
    expect(local.import).not.toHaveBeenCalled()
  })

  it('writes the remote version to local when remote is more recent', async () => {
    const localChar = makeChar('d', '2026-01-01T00:00:00.000Z')
    const remoteChar = makeChar('d', '2026-01-05T00:00:00.000Z')
    const local = makeStore([localChar])
    const remote = makeStore([remoteChar])
    await sync(local, remote)
    expect(local.import).toHaveBeenCalledWith(
      expect.stringContaining('"id":"d"')
    )
    expect(remote.save).not.toHaveBeenCalled()
  })

  it('does nothing when both sides have the same updatedAt', async () => {
    const char = makeChar('e', '2026-01-01T00:00:00.000Z')
    const local = makeStore([char])
    const remote = makeStore([{ ...char }])
    await sync(local, remote)
    expect(local.import).not.toHaveBeenCalled()
    expect(remote.save).not.toHaveBeenCalled()
  })

  it('handles multiple characters correctly in one pass', async () => {
    const local = makeStore([
      makeChar('f', '2026-01-03T00:00:00.000Z'), // local ahead
      makeChar('g', '2026-01-01T00:00:00.000Z'), // remote ahead
    ])
    const remote = makeStore([
      makeChar('f', '2026-01-01T00:00:00.000Z'),
      makeChar('g', '2026-01-05T00:00:00.000Z'),
    ])
    await sync(local, remote)
    expect(remote.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'f' })
    )
    expect(local.import).toHaveBeenCalledWith(
      expect.stringContaining('"id":"g"')
    )
  })
})

describe('createSyncedCharacterStore', () => {
  describe('when not authenticated (default state)', () => {
    it('reads from local only', async () => {
      const localChar = makeChar('x', '2026-01-01T00:00:00.000Z')
      const local = makeStore([localChar])
      const remote = makeStore([])
      const store = createSyncedCharacterStore(local, remote)
      const result = await store.getAll()
      expect(result).toContain(localChar)
      expect(remote.getAll).not.toHaveBeenCalled()
    })

    it('writes to local only', async () => {
      const local = makeStore([])
      const remote = makeStore([])
      const store = createSyncedCharacterStore(local, remote)
      await store.save(makeChar('y', '2026-01-01T00:00:00.000Z'))
      expect(local.save).toHaveBeenCalled()
      expect(remote.save).not.toHaveBeenCalled()
    })
  })

  describe('after login()', () => {
    it('runs the initial bidirectional sync on login', async () => {
      const localChar = makeChar('a', '2026-01-03T00:00:00.000Z')
      const remoteChar = makeChar('b', '2026-01-05T00:00:00.000Z')
      const local = makeStore([localChar])
      const remote = makeStore([remoteChar])
      const store = createSyncedCharacterStore(local, remote)
      await store.login()
      expect(remote.save).toHaveBeenCalledWith(localChar)
      expect(local.import).toHaveBeenCalledWith(
        expect.stringContaining('"id":"b"')
      )
    })

    it('reads from remote', async () => {
      const remoteChar = makeChar('z', '2026-01-01T00:00:00.000Z')
      const local = makeStore([])
      const remote = makeStore([remoteChar])
      const store = createSyncedCharacterStore(local, remote)
      await store.login()
      ;(remote.getAll as ReturnType<typeof vi.fn>).mockClear()
      await store.getAll()
      expect(remote.getAll).toHaveBeenCalled()
    })

    it('dual-writes on save: local first, then remote', async () => {
      const local = makeStore([])
      const remote = makeStore([])
      const store = createSyncedCharacterStore(local, remote)
      await store.login()
      await store.save(makeChar('w', '2026-01-01T00:00:00.000Z'))
      expect(local.save).toHaveBeenCalled()
      expect(remote.save).toHaveBeenCalled()
    })

    it('succeeds on save even if the remote write fails', async () => {
      const local = makeStore([])
      const remote = makeStore([])
      ;(remote.save as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('network error')
      )
      const store = createSyncedCharacterStore(local, remote)
      await store.login()
      await expect(
        store.save(makeChar('v', '2026-01-01T00:00:00.000Z'))
      ).resolves.toBeDefined()
      expect(local.save).toHaveBeenCalled()
    })

    it('dual-writes on delete', async () => {
      const char = makeChar('del', '2026-01-01T00:00:00.000Z')
      const local = makeStore([char])
      const remote = makeStore([char])
      const store = createSyncedCharacterStore(local, remote)
      await store.login()
      await store.delete('del')
      expect(local.delete).toHaveBeenCalledWith('del')
      expect(remote.delete).toHaveBeenCalledWith('del')
    })
  })

  describe('after logout()', () => {
    it('reads from local again after logout', async () => {
      const local = makeStore([makeChar('a', '2026-01-01T00:00:00.000Z')])
      const remote = makeStore([])
      const store = createSyncedCharacterStore(local, remote)
      await store.login()
      store.logout()
      ;(local.getAll as ReturnType<typeof vi.fn>).mockClear()
      ;(remote.getAll as ReturnType<typeof vi.fn>).mockClear()
      await store.getAll()
      expect(local.getAll).toHaveBeenCalled()
      expect(remote.getAll).not.toHaveBeenCalled()
    })

    it('writes to local only after logout', async () => {
      const local = makeStore([])
      const remote = makeStore([])
      const store = createSyncedCharacterStore(local, remote)
      await store.login()
      store.logout()
      ;(remote.save as ReturnType<typeof vi.fn>).mockClear()
      await store.save(makeChar('p', '2026-01-01T00:00:00.000Z'))
      expect(remote.save).not.toHaveBeenCalled()
    })
  })

  describe('syncToRemote()', () => {
    it('pushes a locally-added character to remote when authenticated', async () => {
      // Start with both stores in agreement so login sync is a no-op.
      const existing = makeChar('existing', '2026-01-01T00:00:00.000Z')
      const local = makeStore([existing])
      const remote = makeStore([existing])
      const store = createSyncedCharacterStore(local, remote)
      await store.login()

      // Directly add a new character to the local mock (simulates a save while offline).
      const newChar = makeChar('new', '2026-01-10T00:00:00.000Z')
      await (local.save as ReturnType<typeof vi.fn>)(newChar)
      ;(remote.save as ReturnType<typeof vi.fn>).mockClear()

      await store.syncToRemote()
      expect(remote.save).toHaveBeenCalledWith(newChar)
    })

    it('pulls a remote-only character to local when authenticated', async () => {
      const local = makeStore([])
      const remoteChar = makeChar('remote-only', '2026-01-05T00:00:00.000Z')
      const remote = makeStore([remoteChar])
      const store = createSyncedCharacterStore(local, remote)
      await store.login() // pulls remoteChar to local as part of initial sync

      // Add another remote-only char after login (simulates another device saving while we were offline)
      const anotherChar = makeChar('another', '2026-01-08T00:00:00.000Z')
      await (remote.save as ReturnType<typeof vi.fn>)(anotherChar)
      ;(local.import as ReturnType<typeof vi.fn>).mockClear()

      await store.syncToRemote()
      expect(local.import).toHaveBeenCalledWith(
        expect.stringContaining('"id":"another"')
      )
    })

    it('does nothing when not authenticated', async () => {
      const local = makeStore([makeChar('r', '2026-01-01T00:00:00.000Z')])
      const remote = makeStore([])
      const store = createSyncedCharacterStore(local, remote)
      await store.syncToRemote()
      expect(remote.save).not.toHaveBeenCalled()
      expect(remote.getAll).not.toHaveBeenCalled()
    })
  })
})
