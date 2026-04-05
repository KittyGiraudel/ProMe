import { beforeEach, describe, expect, it } from 'vitest'
import { createLocalStorageCharacterStore } from './localStorageStore'

type MemoryStorage = {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  clear: () => void
}

function createMemoryStorage(): MemoryStorage {
  const data = new Map<string, string>()
  return {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value)
    },
    removeItem: key => {
      data.delete(key)
    },
    clear: () => {
      data.clear()
    },
  }
}

beforeEach(() => {
  ;(globalThis as { window?: { localStorage: MemoryStorage } }).window = {
    localStorage: createMemoryStorage(),
  }
})

describe('character/store/localStorageStore dead freeze', () => {
  it('rejects modifications to existing dead characters', () => {
    const store = createLocalStorageCharacterStore()
    const alive = store.create({ name: 'A' })
    const dead = store.save({ ...alive, lifeStatus: 'dead' })

    expect(() =>
      store.save({
        ...dead,
        name: 'Changed after death',
      })
    ).toThrow('DEAD_CHARACTER')
  })

  it('allows idempotent save payload for dead characters', () => {
    const store = createLocalStorageCharacterStore()
    const alive = store.create({ name: 'B' })
    const dead = store.save({ ...alive, lifeStatus: 'dead' })
    const savedAgain = store.save(dead)
    expect(savedAgain.lifeStatus).toBe('dead')
    expect(savedAgain.id).toBe(dead.id)
  })

  it('allows revive without any other mutation', () => {
    const store = createLocalStorageCharacterStore()
    const alive = store.create({ name: 'C' })
    const dead = store.save({ ...alive, lifeStatus: 'dead' })
    const revived = store.save({ ...dead, lifeStatus: 'alive' })
    expect(revived.lifeStatus).toBe('alive')
    expect(revived.name).toBe(alive.name)
  })
})
