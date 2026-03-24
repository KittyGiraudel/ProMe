import { describe, expect, it } from 'vitest'
import { biomeAtCurrentMapPosition } from './biomeAtCurrentMapPosition'

describe('biomeAtCurrentMapPosition', () => {
  it('returns unexplored when the current cell has no entry', () => {
    expect(
      biomeAtCurrentMapPosition({
        currentPosition: { q: 1, r: 0 },
        cells: [],
      })
    ).toBe('unexplored')
  })

  it('returns biome when the current cell is marked', () => {
    expect(
      biomeAtCurrentMapPosition({
        currentPosition: { q: 1, r: 0 },
        cells: [{ q: 1, r: 0, biome: 'fieldSea' }],
      })
    ).toBe('fieldSea')
  })

  it('returns unexplored when the cell exists but has no biome', () => {
    expect(
      biomeAtCurrentMapPosition({
        currentPosition: { q: 0, r: 0 },
        cells: [{ q: 0, r: 0, icon: '🏠' }],
      })
    ).toBe('unexplored')
  })
})
