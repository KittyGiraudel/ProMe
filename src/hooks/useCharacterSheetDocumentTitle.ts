'use client'

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import type { Character } from '@/lib/character/types'

export function useCharacterSheetDocumentTitle({
  character,
}: {
  character: Character | null
}) {
  const t = useTranslations()

  useEffect(
    function addNameToPageTitle() {
      if (!character) {
        document.title = `${t('characters.not_found_title')} — ${t('metadata.tab_brand')}`
        return
      }

      const displayName = character.name?.trim() || t('characters_list.unnamed')
      document.title = `${displayName} — ${t('metadata.tab_brand')}`
    },
    [character, t]
  )
}
