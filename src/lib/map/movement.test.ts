import { describe, expect, it } from 'vitest'
import type { CharacterMapState } from '@/lib/character/types'
import { moveWithAutoBiome } from './movement'

describe('moveWithAutoBiome', () => {
  it('does nothing for non-adjacent target', () => {
    const current: CharacterMapState = {
      currentPosition: { q: 0, r: 0 },
      cells: [],
    }
    const result = moveWithAutoBiome(current, { q: 3, r: 3 }, () => 0.2)
    expect(result.next).toEqual(current)
    expect(result.discoveredBiome).toBeUndefined()
  })

  it('moves and auto-discovers biome on unexplored adjacent target', () => {
    const current: CharacterMapState = {
      currentPosition: { q: 0, r: 0 },
      cells: [],
    }
    const result = moveWithAutoBiome(current, { q: 1, r: 0 }, () => 0.2)
    expect(result.next.currentPosition).toEqual({ q: 1, r: 0 })
    expect(result.next.cells).toContainEqual({
      q: 1,
      r: 0,
      biome: 'floodedPlains',
      icon: undefined,
    })
    expect(result.discoveredBiome?.biome).toBe('floodedPlains')
  })

  it('moves without rolling when target already has a biome', () => {
    const current: CharacterMapState = {
      currentPosition: { q: 0, r: 0 },
      cells: [{ q: 1, r: 0, biome: 'shadowForest' }],
    }
    const result = moveWithAutoBiome(current, { q: 1, r: 0 }, () => 0.99)
    expect(result.next.currentPosition).toEqual({ q: 1, r: 0 })
    expect(result.next.cells).toEqual(current.cells)
    expect(result.discoveredBiome).toBeUndefined()
  })

  it('moves to the Core without auto-assigning biome', () => {
    const current: CharacterMapState = {
      currentPosition: { q: 0, r: -1 },
      cells: [],
    }
    const result = moveWithAutoBiome(current, { q: 0, r: 0 }, () => 0.2)
    expect(result.next.currentPosition).toEqual({ q: 0, r: 0 })
    expect(result.next.cells).toEqual([])
    expect(result.discoveredBiome).toBeUndefined()
  })
})
