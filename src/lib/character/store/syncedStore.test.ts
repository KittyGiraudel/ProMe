import { describe, expect, it, vi } from 'vitest'
import { sync } from '@/lib/character/store/syncedStore'
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
