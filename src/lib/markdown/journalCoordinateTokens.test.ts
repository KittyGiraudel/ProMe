import { describe, expect, it } from 'vitest'
import { buildJournalCoordinateTokenData } from './journalCoordinateTokens'

describe('markdown/journalCoordinateTokens', () => {
  it('builds coordinate token rules for current sheet cells', () => {
    const data = buildJournalCoordinateTokenData({
      currentPosition: { q: 0, r: 0 },
      cells: [
        { q: 0, r: 0, biome: 'shadowForest' },
        { q: 1, r: 0, biome: 'fieldSea' },
      ],
    })

    expect(data.rules.some(rule => rule.match === 'E13')).toBe(true)
    expect(data.rules.some(rule => rule.match === 'E15')).toBe(true)
    expect(data.biomeByTokenKey.get('coord:E13')).toBe('shadowForest')
    expect(data.biomeByTokenKey.get('coord:E15')).toBe('fieldSea')
  })

  it('ignores cells outside the current sheet', () => {
    const data = buildJournalCoordinateTokenData({
      currentPosition: { q: 0, r: 0 },
      cells: [
        { q: 0, r: 0, biome: 'shadowForest' },
        { q: 12, r: 0, biome: 'silentDesert' },
      ],
    })

    expect(data.rules.some(rule => rule.match === 'E13')).toBe(true)
    expect(data.rules.some(rule => rule.match === 'E01')).toBe(true)
    expect(data.biomeByTokenKey.get('coord:E01')).toBe('unexplored')
  })
})
