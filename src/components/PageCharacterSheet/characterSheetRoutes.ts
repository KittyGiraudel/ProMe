export const CHARACTER_SHEET_TAB_KEYS = [
  {
    id: 'identity',
    path: 'identity',
    key: 'characters.identity.title',
  },
  {
    id: 'map',
    path: 'map',
    key: 'characters.map.title',
  },
  {
    id: 'inventory',
    path: 'inventory',
    key: 'characters.inventory.title',
  },
  {
    id: 'journal',
    path: 'journal',
    key: 'characters.journal.title',
  },
  {
    id: 'tools',
    path: 'tools',
    key: 'characters.tools.title',
  },
  {
    id: 'actions',
    path: 'actions',
    key: 'characters.actions.title',
  },
] as const

export type CharacterSheetTabId =
  (typeof CHARACTER_SHEET_TAB_KEYS)[number]['id']
