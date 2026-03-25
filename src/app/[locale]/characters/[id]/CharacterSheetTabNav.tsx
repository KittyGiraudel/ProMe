'use client'

import { LinkTabNav } from '@/components/LinkTabNav/LinkTabNav'
import { CHARACTER_SHEET_TAB_KEYS } from './characterSheetRoutes'
import { useTranslations } from 'next-intl'

export function CharacterSheetTabNav({ characterId }: { characterId: string }) {
  const t = useTranslations()
  const items = CHARACTER_SHEET_TAB_KEYS.map(({ id, key }) => ({
    id,
    href: `/characters/${characterId}/${id}`,
    label: t(key),
  }))

  return <LinkTabNav items={items} />
}
