'use client'

import { App, type FormInstance } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import { useCharacterFromForm } from './useCharacterFromForm'

export function useCharacterSave({
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
  const t = useTranslations()
  const { message } = App.useApp()
  const store = useMemo(() => getCharacterStore(), [])
  const getCharacterFromForm = useCharacterFromForm({ character, form })

  const save = useCallback(
    (payload: Character): boolean => {
      setSaveErrors(null)

      try {
        const saved = store.save(payload)
        onSaved(saved)
        return true
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error)
        const parts = msg
          .split(';')
          .map(part => part.trim())
          .filter(Boolean)
        setSaveErrors(parts.length ? parts : [msg])
        return false
      }
    },
    [store, getCharacterFromForm, onSaved, message, setSaveErrors]
  )

  const tryToSave = useCallback(() => {
    if (!character) return
    if (character.lifeStatus === 'dead')
      return message.warning(t('characters.dead_readonly_description'))
    if (save(getCharacterFromForm()))
      message.success(t('characters.actions.save_success'))
  }, [character, message, save, getCharacterFromForm, t])

  return useMemo(() => ({ tryToSave, save }), [tryToSave, save])
}
