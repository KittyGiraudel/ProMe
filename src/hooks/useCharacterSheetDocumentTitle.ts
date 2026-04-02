'use client'

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import {
  CHARACTER_SHEET_TAB_KEYS,
  type CharacterSheetTabId,
} from '@/constants/characterSheetRoutes'
import { usePathname } from '@/i18n/navigation'
import type { Character } from '@/lib/character/types'

export function tabKeyFromPathname(pathname: string): CharacterSheetTabId {
  const tab = CHARACTER_SHEET_TAB_KEYS.find(tab => pathname.endsWith(tab.path))
  return tab?.id ?? 'identity'
}

/**
 * Character names (and “not found”) come from `localStorage` after mount, so
 * `generateMetadata` cannot include them. This hook upgrades the tab title once
 * the store has hydrated.
 */
export function useCharacterSheetDocumentTitle({
  character,
}: {
  character: Character | null
}) {
  const t = useTranslations()
  const pathname = usePathname()
  const activeTabId = tabKeyFromPathname(pathname)

  useEffect(
    function addNameToPageTitle() {
      if (!character) {
        document.title = `${t('characters.not_found_title')} — ${t('metadata.tab_brand')}`
        return
      }

      const displayName = character.name?.trim() || t('characters_list.unnamed')
      const suffix = (() => {
        const tab = CHARACTER_SHEET_TAB_KEYS.find(tab => tab.id === activeTabId)
        if (!tab) return ''
        return ` · ${t(tab.key)}`
      })()

      document.title = `${displayName}${suffix} — ${t('metadata.tab_brand')}`
    },
    [character, activeTabId, t]
  )
}
