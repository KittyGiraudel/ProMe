'use client'

import { LinkTabNav } from '@/components/LinkTabNav/LinkTabNav'
import {
  CHARACTER_SHEET_TAB_KEYS,
  characterSheetTabHref,
} from './characterSheetRoutes'

export function CharacterSheetTabNav({ characterId }: { characterId: string }) {
  const items = CHARACTER_SHEET_TAB_KEYS.map(({ key, label }) => ({
    id: key,
    href: characterSheetTabHref(characterId, key),
    label,
  }))

  return <LinkTabNav items={items} />
}
