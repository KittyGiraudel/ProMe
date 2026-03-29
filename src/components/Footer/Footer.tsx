import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import './Footer.css'

export function Footer() {
  const t = useTranslations()

  return (
    <div className='Footer'>
      <span className='Footer__copyright'>{t('footer.copyright')}</span>
      <p className='Footer__application'>
        {t.rich('footer.application', {
          link: chunks => (
            <Link
              href='https://github.com/KittyGiraudel/lsdp'
              target='_blank'
              rel='noopener noreferrer'>
              {chunks}
            </Link>
          ),
        })}
      </p>
    </div>
  )
}
