import { Alert } from 'antd'
import { useTranslations } from 'next-intl'
import { useDismissed } from '@/hooks/useDismissed'
import { Link } from '@/i18n/navigation'

import './BrowserWarning.css'

export function BrowserWarning() {
  const t = useTranslations()
  const { dismissed, dismiss } = useDismissed('browser-warning')

  if (dismissed) return null

  return (
    <Alert
      showIcon
      closable={{ closeIcon: true, onClose: dismiss }}
      type='warning'
      title={t.rich('characters.map.browser_warning', {
        link: content => (
          <Link href='https://caniuse.com/wf-corner-shape' target='_blank'>
            {content}
          </Link>
        ),
      })}
      className='BrowserWarning'
    />
  )
}
