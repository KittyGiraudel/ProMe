'use client'

import { useEffect, useState } from 'react'
import { parseMapCellHash } from '@/lib/map/hashTargets'
import {
  DEFAULT_CHARACTER_SHEET_TAB,
  type CharacterSheetTabKey,
} from './characterSheetTabs'

export function useCharacterSheetActiveTab() {
  const [activeTabKey, setActiveTabKey] = useState<CharacterSheetTabKey>(
    DEFAULT_CHARACTER_SHEET_TAB
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const syncMapHashTab = () => {
      if (parseMapCellHash(window.location.hash)) {
        setActiveTabKey('cartography')
      }
    }
    syncMapHashTab()
    window.addEventListener('hashchange', syncMapHashTab)
    return () => window.removeEventListener('hashchange', syncMapHashTab)
  }, [])

  return { activeTabKey, setActiveTabKey }
}
