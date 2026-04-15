import { useTranslations } from 'next-intl'
import './SkipLink.css'

export function SkipLink() {
  const t = useTranslations()
  return (
    <a href='#main' className='SkipLink'>
      {t('nav.skip_to_content')}
    </a>
  )
}
