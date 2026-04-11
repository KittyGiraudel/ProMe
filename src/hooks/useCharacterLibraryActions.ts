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
        const { id } = await store.import(raw)
        message.success(t('new_character.import_success'))
        router.push(`/characters/${id}`)
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
