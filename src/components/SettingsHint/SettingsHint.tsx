'use client'

import { Alert } from 'antd'
import { useTranslations } from 'next-intl'
import { AppLink } from '@/components/Navigation/AppLink'
import { useDismissed } from '@/hooks/useDismissed'

import './SettingsHint.css'

type SettingsHintId = 'map' | 'journal' | 'village'

export function SettingsHint({ hintId }: { hintId: SettingsHintId }) {
  const t = useTranslations()
  const { dismissed, dismiss } = useDismissed('settings-hint:' + hintId)

  if (dismissed) return null

  return (
    <Alert
      className='SettingsHint'
      type='info'
      closable={{ closeIcon: true, onClose: dismiss }}
      title={t.rich(`settings.hints.${hintId}`, {
        link: content => (
          <AppLink to={{ route: 'settings' }} block>
            {content}
          </AppLink>
        ),
      })}
    />
  )
}
