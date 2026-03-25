'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { Character } from '@/lib/character/types'
import { Button } from '@/components/Button/Button'
import { App, FormInstance } from 'antd'
import { getCharacterStore } from '@/lib/character/store'
import { useCharacterSheetDerived } from './useCharacterSheetDerived'
import { useCharacterFromForm } from './useCharacterFromForm'
import { useLocalize } from '@/app/contexts/LocalizationContext'

const DEATH_SUGGESTION_KEY = 'death-suggestion'

export function useCharacterLifeStatusActions({
  onSaved,
  setSaveErrors,
  form,
  character,
}: {
  onSaved: (saved: Character) => void
  setSaveErrors: (errors: string[] | null) => void
  form: FormInstance
  character: Character | null
}) {
  const localize = useLocalize()
  const { message, notification } = App.useApp()
  const store = useMemo(() => getCharacterStore(), [])
  const getCharacterFromForm = useCharacterFromForm({ character, form })

  const onKill = useCallback(() => {
    try {
      const character = getCharacterFromForm()
      if (character.lifeStatus === 'dead') return
      notification.destroy(DEATH_SUGGESTION_KEY)
      const payload: Character = { ...character, lifeStatus: 'dead' }
      const saved = store.save(payload)
      setSaveErrors(null)
      onSaved(saved)
      message.success(localize.string('characters.markDeadSuccess'))
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      message.error(msg)
    }
  }, [
    setSaveErrors,
    getCharacterFromForm,
    message,
    notification,
    onSaved,
    store,
  ])

  const onRevive = useCallback(() => {
    try {
      const character = getCharacterFromForm()
      if (character.lifeStatus === 'alive') return
      const payload: Character = { ...character, lifeStatus: 'alive' }
      const saved = store.save(payload)
      setSaveErrors(null)
      onSaved(saved)
      message.success(localize.string('characters.reviveSuccess'))
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      message.error(msg)
    }
  }, [setSaveErrors, getCharacterFromForm, message, onSaved, store, localize])

  return {
    onKill,
    onRevive,
  }
}

export const useWarnDeath = ({
  form,
  character,
  onKill,
}: {
  form: FormInstance
  character: Character | null
  onKill: () => void
}) => {
  const localize = useLocalize()
  const { notification } = App.useApp()
  const { healthCurrent } = useCharacterSheetDerived({ form, character })
  const prevHealthCurrentRef = useRef<number | null>(null)

  useEffect(() => {
    if (healthCurrent == null || character == null) return

    if (character.lifeStatus === 'dead') {
      notification.destroy(DEATH_SUGGESTION_KEY)
      prevHealthCurrentRef.current = healthCurrent
      return
    }

    const previous = prevHealthCurrentRef.current
    if (previous != null && previous > 0 && healthCurrent <= 0) {
      notification.warning({
        key: DEATH_SUGGESTION_KEY,
        title: localize.string('characters.deathSuggestionTitle'),
        description: localize.string('characters.deathSuggestionDescription'),
        placement: 'bottomRight',
        duration: 0,
        actions: (
          <Button
            danger
            htmlType='button'
            onClick={() => {
              notification.destroy(DEATH_SUGGESTION_KEY)
              onKill()
            }}>
            {localize.string('characters.markDeadAction')}
          </Button>
        ),
      })
    }
    if (healthCurrent > 0) {
      notification.destroy(DEATH_SUGGESTION_KEY)
    }
    prevHealthCurrentRef.current = healthCurrent
  }, [character, healthCurrent, onKill, notification])
}
