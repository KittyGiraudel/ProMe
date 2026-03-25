export const CHARACTER_SHEET_TAB_KEYS = [
  {
    key: 'identity',
    path: 'identity',
    localizationKey: 'characters.tab_identity'
  },
  {
    key: 'map',
    path: 'map',
    localizationKey: 'characters.tab_map',
  },
  {
    key: 'inventory',
    path: 'inventory',
    localizationKey: 'characters.tab_inventory',
  },
  {
    key: 'journal',
    path: 'journal',
    localizationKey: 'characters.tab_journal',
  },
  {
    key: 'tools',
    path: 'tools',
    localizationKey: 'characters.tab_tools',
  },
  {
    key: 'actions',
    path: 'actions',
    localizationKey: 'characters.tab_actions',
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
