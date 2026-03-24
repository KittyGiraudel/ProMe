'use client'

import { App } from 'antd'
import { useCallback, useMemo } from 'react'
import { getCharacterStore } from '@/lib/character/store'
import { stringifyCharacters } from '@/lib/character/store/migrations'
import type { Character } from '@/lib/character/types'
import { copy } from '@/messages/fr'
import { FormInstance } from 'antd/lib/form'
import { SheetFormValues } from './characterSheetForm'
import { useCharacterFromForm } from './useCharacterFromForm'

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
  const { message } = App.useApp()
  const store = useMemo(() => getCharacterStore(), [])
  const getCharacterFromForm = useCharacterFromForm({ character, form })
  
  const handleSave = useCallback(() => {
    if (!character) return
    if (character.lifeStatus === 'dead') {
      return message.warning(copy.characters.deadReadonlyDescription)
    }

    setSaveErrors(null)

    try {
      const saved = store.save(getCharacterFromForm())
      setSaveErrors(null)
      onSaved(saved)
      message.success(copy.characters.saveSuccess)
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
  ])

  const handleExport = useCallback(() => {
    if (!character) return
    const payload = getCharacterFromForm()
    const content = stringifyCharacters([payload])
    try {
      downloadJsonFile(content, buildCharacterExportFileName(payload))
      message.success(copy.characters.exportDownloaded)
    } catch {
      message.error(copy.characters.exportDownloadError)
    }
  }, [character, getCharacterFromForm, message])

  return {
    handleSave,
    handleExport,
  }
}
