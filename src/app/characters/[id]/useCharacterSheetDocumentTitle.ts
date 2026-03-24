'use client'

import { useEffect } from 'react'
import type { Character } from '@/lib/character/types'
import { copy } from '@/messages/fr'
import {
  CHARACTER_SHEET_TAB_KEYS,
  DEFAULT_CHARACTER_SHEET_TAB,
  type CharacterSheetTabKey,
} from './characterSheetRoutes'
import { usePathname } from 'next/navigation'

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
  const pathname = usePathname()
  const activeTabKey = tabKeyFromPathname(pathname, characterId)

  useEffect(() => {
    if (!hydratedFromStore) return

    if (!character) {
      document.title = `${copy.characters.notFoundTitle} — ${copy.metadata.tabBrand}`
      return
    }

    const displayName = character.name?.trim() || copy.characters.unnamed
    document.title = `${displayName}${getTabSuffix(activeTabKey)} — ${copy.metadata.tabBrand}`
  }, [hydratedFromStore, character, activeTabKey])
}

function getTabSuffix(
  tabKey: CharacterSheetTabKey
): string {
  if (tabKey === DEFAULT_CHARACTER_SHEET_TAB) return ''
  const tab = CHARACTER_SHEET_TAB_KEYS.find(tab => tab.key === tabKey)
  if (!tab) return ''
  return ` · ${tab.label}`
}