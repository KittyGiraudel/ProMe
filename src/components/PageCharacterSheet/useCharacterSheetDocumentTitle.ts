'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import type { Character } from '@/lib/character/types'
import {
  CHARACTER_SHEET_TAB_KEYS,
  type CharacterSheetTabId,
} from './characterSheetRoutes'

function tabKeyFromPathname(
  pathname: string,
  characterId: string
): CharacterSheetTabId {
  const path = pathname.replace(`/characters/${characterId}/`, '')
  const tab = CHARACTER_SHEET_TAB_KEYS.find(tab => tab.path === path)
  return tab?.id ?? 'identity'
}

/**
 * Character names (and “not found”) come from `localStorage` after mount, so
 * `generateMetadata` cannot include them. This hook upgrades the tab title once
 * the store has hydrated.
 */
export function useCharacterSheetDocumentTitle({
  hydratedFromStore,
  character,
  characterId,
}: {
  hydratedFromStore: boolean
  character: Character | null,
  characterId: string
}) {
  const t = useTranslations()
  const pathname = usePathname()
  const activeTabId = tabKeyFromPathname(pathname, characterId)

  useEffect(() => {
    if (!hydratedFromStore) return

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
  }, [hydratedFromStore, character, activeTabId, t])
}
