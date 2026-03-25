'use client'

import { App } from 'antd'
import { useCallback, useMemo } from 'react'
import { getCharacterStore } from '@/lib/character/store'
import { stringifyCharacters } from '@/lib/character/store/migrations'
import type { Character } from '@/lib/character/types'
import { FormInstance } from 'antd/lib/form'
import { useCharacterFromForm } from './useCharacterFromForm'
import { useRouter } from 'next/navigation'
import { useLocalize } from '@/app/contexts/LocalizationContext'

function sanitizeFileNamePart(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9_-]/g, '')
}

function buildCharacterExportFileName(character: Character): string {
  const safeName = sanitizeFileNamePart(character.name) || 'sans-nom'
  const safeId = sanitizeFileNamePart(character.id) || 'id'
  const date = new Date().toISOString().slice(0, 10)
  return `${safeName}-${safeId}-${date}.json`
}

function downloadJsonFile(content: string, fileName: string): void {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

export function useCharacterSheetMainActions({
  character,
  form,
  onSaved,
  setSaveErrors,
}: {
  character: Character | null
  form: FormInstance
  onSaved: (saved: Character) => void
  setSaveErrors: (errors: string[] | null) => void
}) {
  const localize = useLocalize()
  const router = useRouter()
  const { message } = App.useApp()
  const store = useMemo(() => getCharacterStore(), [])
  const getCharacterFromForm = useCharacterFromForm({ character, form })
  
  const onSave = useCallback(() => {
    if (!character) return
    if (character.lifeStatus === 'dead') {
      return message.warning(localize.string('characters.deadReadonlyDescription'))
    }

    setSaveErrors(null)

    try {
      const saved = store.save(getCharacterFromForm())
      setSaveErrors(null)
      onSaved(saved)
      message.success(localize.string('characters.saveSuccess'))
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      const parts = msg
        .split(';')
        .map(part => part.trim())
        .filter(Boolean)
      setSaveErrors(parts.length ? parts : [msg])
      message.error(msg)
    }
  }, [
    character,
    getCharacterFromForm,
    message,
    onSaved,
    setSaveErrors,
    store,
    localize,
  ])

  const onExport = useCallback(() => {
    if (!character) return
    const payload = getCharacterFromForm()
    const content = stringifyCharacters([payload])
    try {
      downloadJsonFile(content, buildCharacterExportFileName(payload))
      message.success(localize.string('characters.exportDownloaded'))
    } catch {
      message.error(localize.string('characters.exportDownloadError'))
    }
  }, [character, getCharacterFromForm, message, localize])

  const onDelete = useCallback(() => {
    if (!character) return
    store.delete(character.id)
    message.success(localize.string('characters.deleteSuccess'))
    // Programmatic navigation is intentionally not routed through the
    // unsaved-changes blocker (which is used by `BlockedLink`).
    router.push('/characters')
  }, [character, localize, message, router, store])

  return {
    onDelete,
    onSave,
    onExport,
  }
}
