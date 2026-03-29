import { describe, expect, it } from 'vitest'
import { lookupName, namesByFaction } from './namesByFaction'

describe('namesByFaction / lookupName', () => {
  it('returns the D66 cell for in-range dice', () => {
    expect(lookupName('bruja', 1, 1)).toBe(namesByFaction.bruja[0]![0])
    expect(lookupName('bruja', 6, 6)).toBe(namesByFaction.bruja[5]![5])
  })

  it('returns an em dash placeholder when dice are out of the 6×6 grid', () => {
    expect(lookupName('bruja', 0, 1)).toBe('—')
    expect(lookupName('bruja', 7, 1)).toBe('—')
    expect(lookupName('bruja', 1, 0)).toBe('—')
    expect(lookupName('bruja', 1, 7)).toBe('—')
  })
})
