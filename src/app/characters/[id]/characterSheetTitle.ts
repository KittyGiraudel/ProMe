import { copy } from '@/messages/fr'
import { type CharacterSheetTabKey, CHARACTER_SHEET_TAB_KEYS } from './characterSheetRoutes'

/**
 * Default `metadata.title` for a sheet tab (no character name — that data lives
 * in localStorage and is only available on the client).
 */
export function characterSheetMetadataTitle(
  tabKey: CharacterSheetTabKey
): string {
  if (tabKey === 'identity')
    return `${copy.characters.sheetTitle} — ${copy.metadata.tabBrand}`

  const tab = CHARACTER_SHEET_TAB_KEYS.find(tab => tab.key === tabKey)

  return `${tab?.label ?? copy.characters.sheetTitle} — ${copy.metadata.tabBrand}`
}
