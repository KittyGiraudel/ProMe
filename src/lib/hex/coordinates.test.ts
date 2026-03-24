import { describe, expect, it } from 'vitest'
import {
  areHexNeighbors,
  getDisplayedCellLabel,
  getGlobalFromDisplayedCellLabel,
  getGlobalFromSheetCell,
  parseDisplayedCellLabel,
} from './coordinates'

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

describe('displayed cell label helpers', () => {
  it('round-trips displayed labels for known cells', () => {
    const sheet = { sheetQ: 0, sheetR: 0 }
    const coord = getGlobalFromSheetCell(sheet, 4, 6) // E13
    const label = getDisplayedCellLabel(coord)
    expect(label).toBe('E13')
    expect(getGlobalFromDisplayedCellLabel(sheet, label)).toEqual(coord)
  })

  it('parses odd and even row parity correctly', () => {
    expect(parseDisplayedCellLabel('E13')).toEqual({
      rowIndex: 4,
      displayColIndex: 12,
    })
    expect(parseDisplayedCellLabel('F12')).toEqual({
      rowIndex: 5,
      displayColIndex: 11,
    })
  })

  it('rejects labels with invalid format or parity', () => {
    expect(parseDisplayedCellLabel('E12')).toBeNull()
    expect(parseDisplayedCellLabel('F13')).toBeNull()
    expect(parseDisplayedCellLabel('Z13')).toBeNull()
    expect(parseDisplayedCellLabel('E99')).toBeNull()
  })
})
