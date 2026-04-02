'use client'

import { App, FormInstance } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Button } from '@/components/Button/Button'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import { useCharacterFromForm } from './useCharacterFromForm'
import { useWatchedStats } from './useCharacterSheetDerived'

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
  const t = useTranslations()
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
      message.success(t('characters.actions.mark_dead_success'))
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
    t,
  ])

  const onRevive = useCallback(() => {
    try {
      const character = getCharacterFromForm()
      if (character.lifeStatus === 'alive') return
      const payload: Character = { ...character, lifeStatus: 'alive' }
      const saved = store.save(payload)
      setSaveErrors(null)
      onSaved(saved)
      message.success(t('characters.actions.revive_success'))
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      message.error(msg)
    }
  }, [setSaveErrors, getCharacterFromForm, message, onSaved, store, t])

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
  const t = useTranslations()
  const { notification } = App.useApp()
  const { health } = useWatchedStats(form)
  const prevHealthCurrentRef = useRef<number | null>(null)

  useEffect(
    function warnOnDeath() {
      if (health.current == null || character == null) return

      if (character.lifeStatus === 'dead') {
        notification.destroy(DEATH_SUGGESTION_KEY)
        prevHealthCurrentRef.current = health.current
        return
      }

      const previous = prevHealthCurrentRef.current
      if (previous != null && previous > 0 && health.current <= 0) {
        notification.warning({
          key: DEATH_SUGGESTION_KEY,
          title: t('characters.actions.death_suggestion_title'),
          description: t('characters.actions.death_suggestion_description'),
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
              {t('characters.actions.mark_dead_action')}
            </Button>
          ),
        })
      }
      if (health.current > 0) {
        notification.destroy(DEATH_SUGGESTION_KEY)
      }
      prevHealthCurrentRef.current = health.current
    },
    [character, health, onKill, notification, t]
  )
}
