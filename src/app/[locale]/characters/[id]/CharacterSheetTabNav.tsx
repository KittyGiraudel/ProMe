'use client'

import { LinkTabNav } from '@/components/LinkTabNav/LinkTabNav'
import {
  CHARACTER_SHEET_TAB_KEYS,
  characterSheetTabHref,
} from './characterSheetRoutes'
import { useTranslations } from 'next-intl'

export function CharacterSheetTabNav({ characterId }: { characterId: string }) {
  const t = useTranslations()
  const items = CHARACTER_SHEET_TAB_KEYS.map(({ key, localizationKey }) => ({
    id: key,
    href: characterSheetTabHref(characterId, key),
    label: t(localizationKey),
  }))

  return <LinkTabNav items={items} />
}
