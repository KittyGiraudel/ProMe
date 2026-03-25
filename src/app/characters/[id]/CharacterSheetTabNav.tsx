'use client'

import { LinkTabNav } from '@/components/LinkTabNav/LinkTabNav'
import {
  CHARACTER_SHEET_TAB_KEYS,
  characterSheetTabHref,
} from './characterSheetRoutes'
import { useLocalize } from '@/app/contexts/LocalizationContext'

export function CharacterSheetTabNav({ characterId }: { characterId: string }) {
  const localize = useLocalize()
  const items = CHARACTER_SHEET_TAB_KEYS.map(({ key, localizationKey }) => ({
    id: key,
    href: characterSheetTabHref(characterId, key),
    label: localize.string(localizationKey),
  }))

  return <LinkTabNav items={items} />
}
