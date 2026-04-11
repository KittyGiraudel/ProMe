import { App } from 'antd'
import type { FormInstance } from 'antd/es/form'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { CardDrawResult } from '@/components/CardDrawResult/CardDrawResult'
import { DiceRollResult } from '@/components/DiceRollResult/DiceRollResult'
import { useSettings } from '@/components/PageSettings/SettingsContext'

export function useKeyboardShortcuts({
  form,
  isDead,
}: {
  form: FormInstance
  isDead: boolean
}) {
  const { settings, updateSettings } = useSettings()
  const { notification } = App.useApp()
  const t = useTranslations()

  useEffect(
    function bindDOMListeners() {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!settings.shortcuts.enabled) return
        const isMeta = e.metaKey || e.ctrlKey

        if (isMeta && e.key === 's') {
          e.preventDefault()
          if (!isDead) form.submit()
        }

        if (isMeta && e.key === 'd') {
          e.preventDefault()
          notification.open({
            key: 'dice-card',
            title: t('characters.tools.title'),
            description: (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <DiceRollResult /> <CardDrawResult />
              </div>
            ),
            placement: 'bottom',
            duration: 4,
            style: { width: 150 },
          })
        }

        if (isMeta && e.key === 'm') {
          e.preventDefault()
          updateSettings(prev => ({
            ...prev,
            sound: { ...prev.sound, enabled: !prev.sound.enabled },
          }))
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    },
    [form, isDead, updateSettings, settings, notification, t]
  )
}
