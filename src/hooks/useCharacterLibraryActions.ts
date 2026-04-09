'use client'

import { App } from 'antd'
import { useTranslations } from 'next-intl'
import { type ChangeEvent, useCallback, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { getCharacterStore } from '@/lib/character/store'

export function useCharacterLibraryActions() {
  const t = useTranslations()
  const store = useMemo(() => getCharacterStore(), [])
  const { message } = App.useApp()
  const router = useRouter()

  const handleImportFile = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      try {
        const raw = await file.text()
        let parsed: { characters?: unknown } | null = null
        try {
          parsed = JSON.parse(raw) as { characters?: unknown }
        } catch {
          message.error(t('new_character.import_error'))
          return
        }

        if (
          !parsed ||
          typeof parsed !== 'object' ||
          !Array.isArray(parsed.characters) ||
          parsed.characters.length !== 1
        ) {
          message.error(t('new_character.import_format_error'))
          return
        }

        const result = store.importAll(raw, 'upsert')
        if (result.totalRead !== 1) {
          message.error(t('new_character.import_format_error'))
          return
        }
        if (result.discarded > 0) {
          message.error(t('new_character.import_data_error'))
          return
        }

        const characterId = (parsed.characters[0] as { id?: string }).id
        message.success(
          t('new_character.import_success', {
            total: result.totalRead,
            created: result.created,
            updated: result.updated,
          })
        )
        if (characterId) {
          router.push(`/characters/${characterId}`)
        }
      } catch {
        message.error(t('new_character.import_error'))
      } finally {
        event.target.value = ''
      }
    },
    [message, store, t, router]
  )

  return {
    handleImportFile,
  }
}
