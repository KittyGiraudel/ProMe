'use client'

import { Alert } from 'antd'
import { useTranslations } from 'next-intl'
import { useDismissed } from '@/hooks/useDismissed'
import './SettingsHint.css'
import { BlockedLink } from '../Navigation/BlockedLink'

type SettingsHintId = 'map' | 'journal' | 'village' | 'sheet'

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
        link: content => <BlockedLink href='/settings'>{content}</BlockedLink>,
      })}
    />
  )
}
