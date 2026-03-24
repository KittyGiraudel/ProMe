'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { Character } from '@/lib/character/types'
import { copy } from '@/messages/fr'
import { Button } from '@/components/Button/Button'
import { App, FormInstance } from 'antd'
import { getCharacterStore } from '@/lib/character/store'
import { useCharacterSheetDerived } from './useCharacterSheetDerived'
import { useCharacterFromForm } from './useCharacterFromForm'

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
  const { message, modal, notification } = App.useApp()
  const store = useMemo(() => getCharacterStore(), [])
  const getCharacterFromForm = useCharacterFromForm({ character, form })

  const onConfirmDeath = useCallback(() => {
    try {
      const character = getCharacterFromForm()
      if (character.lifeStatus === 'dead') return
      notification.destroy(DEATH_SUGGESTION_KEY)
      const payload: Character = { ...character, lifeStatus: 'dead' }
      const saved = store.save(payload)
      setSaveErrors(null)
      onSaved(saved)
      message.success(copy.characters.markDeadSuccess)
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

  const handleMarkAsDead = useCallback(() => {
    modal.confirm({
      title: copy.characters.markDeadConfirmTitle,
      content: copy.characters.markDeadConfirmDescription,
      okText: copy.characters.markDeadAction,
      cancelText: copy.characters.cancel,
      okButtonProps: { danger: true },
      onOk: onConfirmDeath,
    })
  }, [modal, onConfirmDeath])

  const onConfirmRevive = useCallback(() => {
    try {
      const character = getCharacterFromForm()
      if (character.lifeStatus === 'alive') return
      const payload: Character = { ...character, lifeStatus: 'alive' }
      const saved = store.save(payload)
      setSaveErrors(null)
      onSaved(saved)
      message.success(copy.characters.reviveSuccess)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      message.error(msg)
    }
  }, [setSaveErrors, getCharacterFromForm, message, onSaved, store])

  const handleRevive = useCallback(() => {
    modal.confirm({
      title: copy.characters.reviveConfirmTitle,
      content: copy.characters.reviveConfirmDescription,
      okText: copy.characters.reviveAction,
      cancelText: copy.characters.cancel,
      onOk: onConfirmRevive,
    })
  }, [modal, onConfirmRevive])

  return {
    handleMarkAsDead,
    handleRevive,
  }
}

export const useWarnDeath = ({
  form,
  character,
  handleMarkAsDead,
}: {
  form: FormInstance
  character: Character | null
  handleMarkAsDead: () => void
}) => {
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
        title: copy.characters.deathSuggestionTitle,
        description: copy.characters.deathSuggestionDescription,
        placement: 'bottomRight',
        duration: 0,
        actions: (
          <Button
            danger
            htmlType='button'
            onClick={() => {
              notification.destroy(DEATH_SUGGESTION_KEY)
              handleMarkAsDead()
            }}>
            {copy.characters.markDeadAction}
          </Button>
        ),
      })
    }
    if (healthCurrent > 0) {
      notification.destroy(DEATH_SUGGESTION_KEY)
    }
    prevHealthCurrentRef.current = healthCurrent
  }, [character, healthCurrent, handleMarkAsDead, notification])
}
