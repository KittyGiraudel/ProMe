import { Alert } from 'antd'
import { useTranslations } from 'next-intl'
import type { Gender } from '@/lib/types'

export function DeathWarning({
  isDead,
  gender,
}: {
  isDead: boolean
  gender?: Gender
}) {
  const t = useTranslations()
  if (!isDead) return null
  return (
    <Alert
      showIcon
      type='warning'
      title={t('characters.dead_readonly_title')}
      description={t.rich('characters.dead_readonly_description', {
        gender: gender ?? 'indeterminate',
        link: content => <a href='#actions'>{content}</a>,
      })}
    />
  )
}
