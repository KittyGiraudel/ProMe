'use client'

import { useTranslations } from 'next-intl'
import { LinkTabNav } from '@/components/LinkTabNav/LinkTabNav'
import { CHARACTER_SHEET_TAB_KEYS } from '@/constants/characterSheetRoutes'
import { useCharacterLink } from '@/hooks/useCharacterLink'

export function CharacterSheetTabNav() {
  const t = useTranslations()
  const getCharacterLink = useCharacterLink()

  const items = CHARACTER_SHEET_TAB_KEYS.map(({ id, key }) => ({
    id,
    href: getCharacterLink({ tabId: id }),
    label: t(key),
  }))

  return <LinkTabNav items={items} />
}
