export const CHARACTER_SHEET_TAB_KEYS = [
  {
    key: 'identity',
    path: 'identity',
    localizationKey: 'characters.identity.title'
  },
  {
    key: 'map',
    path: 'map',
    localizationKey: 'characters.map.title',
  },
  {
    key: 'inventory',
    path: 'inventory',
    localizationKey: 'characters.inventory.title',
  },
  {
    key: 'journal',
    path: 'journal',
    localizationKey: 'characters.journal.title',
  },
  {
    key: 'tools',
    path: 'tools',
    localizationKey: 'characters.tools.title',
  },
  {
    key: 'actions',
    path: 'actions',
    localizationKey: 'characters.actions.title',
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
