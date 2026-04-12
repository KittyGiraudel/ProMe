'use client'

import { App } from 'antd'
import { useTranslations } from 'next-intl'
import { type ChangeEvent, useCallback, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useCharacterImport } from './useMutation'

export function useCharacterLibraryActions() {
  const { message } = App.useApp()
  const t = useTranslations()
  const router = useRouter()

  const [importCharacter] = useCharacterImport({
    onCompleted: ({ id }) => {
      message.success(t('new_character.import_success'))
      router.push(`/characters/${id}`)
    },
    onError: () => message.error(t('errors.import')),
  })

  const handleImportFile = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
      const raw = await file.text()
      event.target.value = ''
      await importCharacter(raw)
    },
    [importCharacter]
  )

  return useMemo(() => ({ handleImportFile }), [handleImportFile])
}
