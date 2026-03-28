import { Alert } from 'antd'
import { useTranslations } from 'next-intl'
import './BrowserWarning.css'
import { Link } from '@/i18n/navigation'

export function BrowserWarning() {
  const t = useTranslations()

  return (
    <Alert
      closable
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
