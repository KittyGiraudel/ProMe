import { copy } from '@/messages/fr'

export const CHARACTER_SHEET_TAB_KEYS = [
  { key: 'identity', path: 'identity', label: copy.characters.tabIdentity },
  {
    key: 'map',
    path: 'map',
    label: copy.characters.tabMap,
  },
  {
    key: 'inventory',
    path: 'inventory',
    label: copy.characters.tabInventory,
  },
  { key: 'journal', path: 'journal', label: copy.characters.tabJournal },
  { key: 'tools', path: 'tools', label: copy.characters.tabTools },
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
