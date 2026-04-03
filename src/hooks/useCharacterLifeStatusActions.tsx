'use client'

import { App, FormInstance } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Button } from '@/components/Button/Button'
import type { Character } from '@/lib/character/types'
import { SaveForm } from './useCharacterSave'
import { useWatchedStats } from './useCharacterSheetDerived'

const DEATH_SUGGESTION_KEY = 'death-suggestion'

export function useCharacterLifeStatusActions({
  saveForm,
}: {
  saveForm: SaveForm
}) {
  const { notification } = App.useApp()

  const onKill = useCallback(() => {
    notification.destroy(DEATH_SUGGESTION_KEY)
    saveForm(
      { lifeStatus: 'dead' },
      { successKey: 'characters.actions.mark_dead_success' }
    )
  }, [saveForm, notification])

  const onRevive = useCallback(() => {
    saveForm(
      { lifeStatus: 'alive' },
      { successKey: 'characters.actions.revive_success' }
    )
  }, [saveForm])

  return useMemo(() => ({ onKill, onRevive }), [onKill, onRevive])
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
