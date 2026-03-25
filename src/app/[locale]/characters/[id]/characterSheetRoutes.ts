export const CHARACTER_SHEET_TAB_KEYS = [
  {
    key: 'identity',
    path: 'identity',
    localizationKey: 'characters.tabIdentity'
  },
  {
    key: 'map',
    path: 'map',
    localizationKey: 'characters.tabMap',
  },
  {
    key: 'inventory',
    path: 'inventory',
    localizationKey: 'characters.tabInventory',
  },
  {
    key: 'journal',
    path: 'journal',
    localizationKey: 'characters.tabJournal',
  },
  {
    key: 'tools',
    path: 'tools',
    localizationKey: 'characters.tabTools',
  },
  {
    key: 'actions',
    path: 'actions',
    localizationKey: 'characters.tabActions',
  },
] as const

export type CharacterSheetTabKey =
  (typeof CHARACTER_SHEET_TAB_KEYS)[number]['key']

export const DEFAULT_CHARACTER_SHEET_TAB: CharacterSheetTabKey = 'identity'

export function characterSheetTabHref(
  characterId: string,
  tabKey: CharacterSheetTabKey
): string {
  const tab = CHARACTER_SHEET_TAB_KEYS.find(t => t.key === tabKey)
  const path = tab?.path ?? 'identity'
  return `/characters/${characterId}/${path}`
}
