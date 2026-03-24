export const CHARACTER_SHEET_TAB_KEYS = [
  'identityStats',
  'cartography',
  'inventorySpellbook',
  'journal',
  'tools',
] as const

export type CharacterSheetTabKey = (typeof CHARACTER_SHEET_TAB_KEYS)[number]

export const DEFAULT_CHARACTER_SHEET_TAB: CharacterSheetTabKey = 'identityStats'
