import type { FormInstance } from 'antd/es/form'
import { useEffect } from 'react'
import { useCardDrawNotification } from '@/components/CardDrawResult/CardDrawResult'
import { useDiceRollNotification } from '@/components/DiceRollResult/DiceRollResult'
import { useSettings } from '@/components/PageSettings/SettingsContext'

export function useKeyboardShortcuts({
  form,
  isDead,
}: {
  form: FormInstance
  isDead: boolean
}) {
  const { updateSettings } = useSettings()
  const openDiceRollNotification = useDiceRollNotification()
  const openCardDrawNotification = useCardDrawNotification()

  useEffect(
    function bindDOMListeners() {
      const handleKeyDown = (e: KeyboardEvent) => {
        const isMeta = e.metaKey || e.ctrlKey

        if (isMeta && e.key === 's') {
          e.preventDefault()
          if (!isDead) form.submit()
        }

        if (isMeta && e.key === 'r') {
          e.preventDefault()
          openDiceRollNotification()
        }

        if (isMeta && e.key === 'd') {
          e.preventDefault()
          openCardDrawNotification()
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
    [
      form,
      isDead,
      openDiceRollNotification,
      openCardDrawNotification,
      updateSettings,
    ]
  )
}
