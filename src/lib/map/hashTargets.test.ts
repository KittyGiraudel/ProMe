import { describe, expect, it } from 'vitest'
import { getGlobalFromSheetCell } from '@/lib/hex/coordinates'
import { getMapCellHash, getMapCellId, parseMapCellHash } from './hashTargets'

describe('map/hashTargets', () => {
  it('uses label-based IDs and hashes for default sheet', () => {
    const coord = getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 4, 6) // E13
    expect(getMapCellId(coord)).toBe('map-E13')
    expect(getMapCellHash(coord)).toBe('#map-E13')
    expect(parseMapCellHash('#map-E13')).toEqual(coord)
  })

  it('includes explicit sheet suffix outside (0,0)', () => {
    const coord = getGlobalFromSheetCell({ sheetQ: 1, sheetR: -2 }, 4, 6) // E13@1,-2
    expect(getMapCellId(coord)).toBe('map-E13@1,-2')
    expect(getMapCellHash(coord)).toBe('#map-E13@1,-2')
    expect(parseMapCellHash('#map-E13@1,-2')).toEqual(coord)
  })

  it('parses URL-encoded label hashes', () => {
    const coord = getGlobalFromSheetCell({ sheetQ: 1, sheetR: -2 }, 4, 6) // E13@1,-2
    expect(parseMapCellHash('#map-E13%401%2C-2')).toEqual(coord)
  })
})

