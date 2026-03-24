import { describe, expect, it } from 'vitest'
import { areHexNeighbors, getGlobalFromSheetCell } from './coordinates'

describe('areHexNeighbors', () => {
  it('matches rendered neighbor pattern for E11', () => {
    const center = getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 4, 5) // E11
    const expectedNeighbors = [
      getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 4, 4), // E09
      getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 4, 6), // E13
      getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 3, 4), // D10
      getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 3, 5), // D12
      getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 5, 4), // F10
      getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 5, 5), // F12
    ]

    for (const neighbor of expectedNeighbors) {
      expect(areHexNeighbors(center, neighbor)).toBe(true)
    }
  })

  it('matches rendered neighbor pattern for F12', () => {
    const center = getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 5, 5) // F12
    const expectedNeighbors = [
      getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 4, 5), // E11
      getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 4, 6), // E13
      getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 5, 4), // F10
      getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 5, 6), // F14
      getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 6, 5), // G11
      getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 6, 6), // G13
    ]

    for (const neighbor of expectedNeighbors) {
      expect(areHexNeighbors(center, neighbor)).toBe(true)
    }
  })

  it('rejects close but non-adjacent cells for E11', () => {
    const center = getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 4, 5) // E11
    const notNeighbors = [
      getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 3, 6), // D14
      getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 3, 7), // D16
      getGlobalFromSheetCell({ sheetQ: 0, sheetR: 0 }, 5, 6), // F14
    ]

    for (const notNeighbor of notNeighbors) {
      expect(areHexNeighbors(center, notNeighbor)).toBe(false)
    }
  })
})
