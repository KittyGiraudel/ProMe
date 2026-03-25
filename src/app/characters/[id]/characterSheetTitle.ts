import { getMessages } from '@/messages/locales'
import { type CharacterSheetTabKey, CHARACTER_SHEET_TAB_KEYS } from './characterSheetRoutes'
import { resolveByPath } from '@/lib/localization/localize'

/**
 * Default `metadata.title` for a sheet tab (no character name — that data lives
 * in localStorage and is only available on the client).
 */
export function characterSheetMetadataTitle(
  tabKey: CharacterSheetTabKey
): string {
  const copy = getMessages()
  if (tabKey === 'identity')
    return `${copy.characters.sheetTitle} — ${copy.metadata.tabBrand}`

  const tab = CHARACTER_SHEET_TAB_KEYS.find(tab => tab.key === tabKey)

  const label = tab?.localizationKey
    ? resolveByPath(copy, tab.localizationKey)
    : undefined

  return `${typeof label === 'string' ? label : copy.characters.sheetTitle} — ${copy.metadata.tabBrand}`
}
