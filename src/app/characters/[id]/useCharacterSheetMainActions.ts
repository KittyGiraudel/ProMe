'use client'

import { App } from 'antd'
import { useCallback, useMemo } from 'react'
import { getCharacterStore } from '@/lib/character/store'
import { stringifyCharacters } from '@/lib/character/store/migrations'
import type { Character } from '@/lib/character/types'
import { copy } from '@/messages/fr'

export function useCharacterSheetMainActions({
  character,
  getCharacterFromForm,
  onSaved,
  setSaveErrors,
}: {
  character: Character | null
  getCharacterFromForm: () => Character
  onSaved: (saved: Character) => void
  setSaveErrors: (errors: string[] | null) => void
}) {
  const { message } = App.useApp()
  const store = useMemo(() => getCharacterStore(), [])

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

  const handleExport = useCallback(async () => {
    if (!character) return
    const payload = getCharacterFromForm()
    const content = stringifyCharacters([payload])
    try {
      await navigator.clipboard.writeText(content)
      message.success(copy.characters.exportCopied)
    } catch {
      message.error(copy.characters.exportCopyError)
    }
  }, [character, getCharacterFromForm, message])

  return {
    handleSave,
    handleExport,
  }
}
