'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { Character } from '@/lib/character/types'
import { copy } from '@/messages/fr'
import { Button } from '@/components/Button/Button'
import { App } from 'antd'
import { getCharacterStore } from '@/lib/character/store'

export function useCharacterLifeStatusActions({
  getCharacter,
  deathSuggestionNotificationKey,
  healthCurrent,
  onSaved,
  clearSaveErrors,
}: {
  getCharacter: () => Character
  deathSuggestionNotificationKey: string
  healthCurrent: number | undefined
  onSaved: (saved: Character) => void
  clearSaveErrors: () => void
}) {
  const { message, modal, notification } = App.useApp()
  const prevHealthCurrentRef = useRef<number | null>(null)
  const store = useMemo(() => getCharacterStore(), [])

  const onConfirmDeath = useCallback(() => {
    try {
      const character = getCharacter()
      if (character.lifeStatus === 'dead') return
      notification.destroy(deathSuggestionNotificationKey)
      const payload: Character = { ...character, lifeStatus: 'dead' }
      const saved = store.save(payload)
      clearSaveErrors()
      onSaved(saved)
      message.success(copy.characters.markDeadSuccess)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      message.error(msg)
    }
  }, [
    clearSaveErrors,
    deathSuggestionNotificationKey,
    getCharacter,
    message,
    modal,
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
      const character = getCharacter()
      if (character.lifeStatus === 'alive') return
      const payload: Character = { ...character, lifeStatus: 'alive' }
      const saved = store.save(payload)
      clearSaveErrors()
      onSaved(saved)
      message.success(copy.characters.reviveSuccess)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      message.error(msg)
    }
  }, [clearSaveErrors, getCharacter, message, onSaved, store])

  const handleRevive = useCallback(() => {
    modal.confirm({
      title: copy.characters.reviveConfirmTitle,
      content: copy.characters.reviveConfirmDescription,
      okText: copy.characters.reviveAction,
      cancelText: copy.characters.cancel,
      onOk: onConfirmRevive,
    })
  }, [modal, onConfirmRevive])

  useEffect(() => {
    if (healthCurrent == null) return

    let character: Character
    try {
      character = getCharacter()
    } catch {
      return
    }

    if (character.lifeStatus === 'dead') {
      notification.destroy(deathSuggestionNotificationKey)
      prevHealthCurrentRef.current = healthCurrent
      return
    }

    const previous = prevHealthCurrentRef.current
    if (previous != null && previous > 0 && healthCurrent <= 0) {
      notification.warning({
        key: deathSuggestionNotificationKey,
        title: copy.characters.deathSuggestionTitle,
        description: copy.characters.deathSuggestionDescription,
        placement: 'bottomRight',
        duration: 0,
        actions: (
          <Button
            danger
            htmlType='button'
            onClick={() => {
              notification.destroy(deathSuggestionNotificationKey)
              handleMarkAsDead()
            }}>
            {copy.characters.markDeadAction}
          </Button>
        ),
      })
    }
    if (healthCurrent > 0) {
      notification.destroy(deathSuggestionNotificationKey)
    }
    prevHealthCurrentRef.current = healthCurrent
  }, [
    getCharacter,
    deathSuggestionNotificationKey,
    handleMarkAsDead,
    healthCurrent,
    notification,
  ])

  return {
    handleMarkAsDead,
    handleRevive,
  }
}
