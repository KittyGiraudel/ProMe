'use client'

import { App, Button } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { SaveForm } from './useCharacterSave'
import { useWatchedHealth } from './useCharacterSheetDerived'

const DEATH_SUGGESTION_KEY = 'death-suggestion'

export function useCharacterLifeStatusActions({
  saveForm,
}: {
  saveForm: SaveForm
}) {
  const { notification } = App.useApp()

  const onKill = useCallback(() => {
    notification.destroy(DEATH_SUGGESTION_KEY)
    // We cannot use `form.submit()` here because `lifeStatus` is not actually a
    // field inside the form that we can modify manually.
    saveForm(
      { lifeStatus: 'dead' },
      { successKey: 'characters.actions.mark_dead_success' }
    )
  }, [saveForm, notification])

  const onRevive = useCallback(() => {
    // We cannot use `form.submit()` here because `lifeStatus` is not actually a
    // field inside the form that we can modify manually.
    saveForm(
      { lifeStatus: 'alive' },
      { successKey: 'characters.actions.revive_success' }
    )
  }, [saveForm])

  return useMemo(() => ({ onKill, onRevive }), [onKill, onRevive])
}

export const useWarnDeath = ({
  isDead,
  saveForm,
}: {
  isDead: boolean
  saveForm: SaveForm
}) => {
  const t = useTranslations()
  const { notification } = App.useApp()
  const { health } = useWatchedHealth()
  const prevHealthCurrentRef = useRef<number | null>(null)
  const { onKill } = useCharacterLifeStatusActions({ saveForm })

  const warn = useCallback(
    () =>
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
      }),
    [notification, t, onKill]
  )

  useEffect(
    function warnOnDeath() {
      if (health.current == null) return

      // Once the character is marked as dead or if there health got back up,
      // hide the notification that suggests marking them as dead.
      if (isDead || health.current > 0)
        notification.destroy(DEATH_SUGGESTION_KEY)
      // Otherwise if their health goes from non-zero to zero, warn about death
      // and suggest marking them as dead.
      else if (
        prevHealthCurrentRef.current &&
        prevHealthCurrentRef.current > 0 &&
        health.current <= 0
      )
        warn()

      // Update the previous health value to the current health value.
      prevHealthCurrentRef.current = health.current
    },
    [isDead, health, warn, notification]
  )
}
