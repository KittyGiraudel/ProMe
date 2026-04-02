import { App } from 'antd'
import type { FormInstance } from 'antd/es/form'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'
import { CardDrawResult } from '@/components/CardDraw/CardDrawResult'
import { DiceRollResult } from '@/components/DiceRoll/DiceRollResult'

export function useKeyboardShortcuts({
  form,
  isDead,
}: {
  form: FormInstance
  isDead: boolean
}) {
  const t = useTranslations()
  const { notification } = App.useApp()

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
          notification.open({
            title: t('characters.tools.die_title'),
            description: <DiceRollResult />,
            placement: 'bottomLeft',
          })
        }

        if (isMeta && e.key === 'd') {
          e.preventDefault()
          notification.open({
            title: t('characters.tools.card_title'),
            description: <CardDrawResult />,
            placement: 'bottomLeft',
          })
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    },
    [form, isDead, notification, t]
  )
}
