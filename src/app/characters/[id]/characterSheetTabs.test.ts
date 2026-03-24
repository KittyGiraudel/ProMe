import { describe, expect, it } from 'vitest'
import {
  CHARACTER_SHEET_TAB_KEYS,
  DEFAULT_CHARACTER_SHEET_TAB,
} from './characterSheetTabs'

describe('characterSheetTabs', () => {
  it('keeps the phase-4 tab order stable', () => {
    expect(CHARACTER_SHEET_TAB_KEYS).toEqual([
      'identityStats',
      'cartography',
      'inventorySpellbook',
      'journal',
      'tools',
    ])
  })

  it('uses identity/stats as the default landing tab', () => {
    expect(DEFAULT_CHARACTER_SHEET_TAB).toBe('identityStats')
  })
})
