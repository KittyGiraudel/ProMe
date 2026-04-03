'use client'

import { App, type FormInstance } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import { useCharacterFromForm } from './useCharacterFromForm'

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
  const t = useTranslations()
  const router = useRouter()
  const { message } = App.useApp()
  const store = useMemo(() => getCharacterStore(), [])
  const getCharacterFromForm = useCharacterFromForm({ character, form })

  const onSave = useCallback(() => {
    if (!character) return
    if (character.lifeStatus === 'dead') {
      return message.warning(t('characters.dead_readonly_description'))
    }

    setSaveErrors(null)

    try {
      const saved = store.save(getCharacterFromForm())
      setSaveErrors(null)
      onSaved(saved)
      message.success(t('characters.actions.save_success'))
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
    t,
  ])

  return {
    onSave,
  }
}
