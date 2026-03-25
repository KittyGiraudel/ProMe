'use client'

import { useEffect } from 'react'
import type { Character } from '@/lib/character/types'
import {
  CHARACTER_SHEET_TAB_KEYS,
  DEFAULT_CHARACTER_SHEET_TAB,
  type CharacterSheetTabKey,
} from './characterSheetRoutes'
import { usePathname } from 'next/navigation'
import { useLocalize } from '@/app/contexts/LocalizationContext'

function tabKeyFromPathname(
  pathname: string,
  characterId: string
): CharacterSheetTabKey {
  const path = pathname.replace(`/characters/${characterId}/`, '')
  const tab = CHARACTER_SHEET_TAB_KEYS.find(tab => tab.path === path)
  return tab?.key ?? DEFAULT_CHARACTER_SHEET_TAB 
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
  const localize = useLocalize()
  const pathname = usePathname()
  const activeTabKey = tabKeyFromPathname(pathname, characterId)

  useEffect(() => {
    if (!hydratedFromStore) return

    if (!character) {
      document.title = `${localize.string('characters.notFoundTitle')} — ${localize.string('metadata.tabBrand')}`
      return
    }

    const displayName = character.name?.trim() || localize.string('characters.unnamed')
    const suffix = (() => {
      if (activeTabKey === DEFAULT_CHARACTER_SHEET_TAB) return ''
      const tab = CHARACTER_SHEET_TAB_KEYS.find(tab => tab.key === activeTabKey)
      if (!tab) return ''
      return ` · ${localize.string(tab.localizationKey)}`
    })()

    document.title = `${displayName}${suffix} — ${localize.string('metadata.tabBrand')}`
  }, [hydratedFromStore, character, activeTabKey])
}
