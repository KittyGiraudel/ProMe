'use client'

import { App } from 'antd'
import { useCallback, useMemo } from 'react'
import type { ChangeEvent } from 'react'
import { getCharacterStore } from '@/lib/character/store'
import { useLocalize } from '../contexts/LocalizationContext'

export function useCharacterLibraryActions({
  refresh,
}: {
  refresh: () => void
}) {
  const localize = useLocalize()
  const store = useMemo(() => getCharacterStore(), [])
  const { message } = App.useApp()

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
          message.error(localize.string('characters.importError'))
          return
        }

        if (
          !parsed ||
          typeof parsed !== 'object' ||
          !Array.isArray(parsed.characters) ||
          parsed.characters.length !== 1
        ) {
          message.error(localize.string('characters.importFormatError'))
          return
        }

        const result = store.importAll(raw, 'upsert')
        if (result.totalRead !== 1) {
          message.error(localize.string('characters.importFormatError'))
          return
        }
        if (result.discarded > 0) {
          message.error(localize.string('characters.importDataError'))
          return
        }

        refresh()
        message.success(
          localize.string('characters.simportSuccess', {
            total: result.totalRead,
            created: result.created,
            updated: result.updated,
          }),
        )
      } catch {
        message.error(localize.string('characters.importError'))
      } finally {
        event.target.value = ''
      }
    },
    [message, refresh, store],
  )

  return {
    handleImportFile,
  }
}
