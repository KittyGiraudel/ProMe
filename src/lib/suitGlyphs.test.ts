import { describe, expect, it } from 'vitest'
import { isFaceRank, suitIsRed } from './suitGlyphs'

describe('suitIsRed', () => {
  it('marks hearts and diamonds as red', () => {
    expect(suitIsRed('hearts')).toBe(true)
    expect(suitIsRed('diamonds')).toBe(true)
  })

  it('marks clubs and spades as not red', () => {
    expect(suitIsRed('clubs')).toBe(false)
    expect(suitIsRed('spades')).toBe(false)
  })
})

describe('types / isFaceRank', () => {
  it('is true only for J, Q, K', () => {
    expect(isFaceRank('J')).toBe(true)
    expect(isFaceRank('Q')).toBe(true)
    expect(isFaceRank('K')).toBe(true)
  })

  it('is false for numbered ranks and ace', () => {
    for (const rank of [
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      'A',
    ] as const) {
      expect(isFaceRank(rank)).toBe(false)
    }
  })
})
