'use client'

import { Alert } from 'antd'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import './SettingsHint.css'

type SettingsHintId = 'map' | 'journal' | 'village' | 'sheet'

export function SettingsHint({ hintId }: { hintId: SettingsHintId }) {
  const t = useTranslations()

  return (
    <Alert
      className='SettingsHint'
      type='info'
      closable
      title={t.rich(`settings.hints.${hintId}`, {
        link: content => <Link href='/settings'>{content}</Link>,
      })}
    />
  )
}
