'use client'

import { App } from 'antd'
import { useCallback, useMemo } from 'react'
import type { ChangeEvent } from 'react'
import { copy } from '@/messages/fr'
import { getCharacterStore } from '@/lib/character/store'

export function useCharacterLibraryActions({
  refresh,
}: {
  refresh: () => void
}) {
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
          message.error(copy.characters.importError)
          return
        }

        if (
          !parsed ||
          typeof parsed !== 'object' ||
          !Array.isArray(parsed.characters) ||
          parsed.characters.length !== 1
        ) {
          message.error(copy.characters.importFormatError)
          return
        }

        const result = store.importAll(raw, 'upsert')
        if (result.totalRead !== 1) {
          message.error(copy.characters.importFormatError)
          return
        }
        if (result.discarded > 0) {
          message.error(copy.characters.importDataError)
          return
        }

        refresh()
        message.success(
          copy.characters.importSuccess(
            result.totalRead,
            result.created,
            result.updated,
          ),
        )
      } catch {
        message.error(copy.characters.importError)
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
