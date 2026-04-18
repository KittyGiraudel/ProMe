import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

import './Footer.css'

const COMMIT_SHA = process.env.NEXT_PUBLIC_COMMIT_SHA

export function Footer() {
  const t = useTranslations()

  return (
    <div className='Footer'>
      <p className='Footer__copyright'>{t('footer.copyright')}</p>
      <p className='Footer__application'>
        {t.rich('footer.application', {
          link_author: chunks => (
            <Link
              href='https://kittygiraudel.com'
              target='_blank'
              rel='noopener noreferrer'>
              {chunks}
            </Link>
          ),
          link_github: chunks => (
            <Link
              href='https://github.com/KittyGiraudel/ProMe'
              target='_blank'
              rel='noopener noreferrer'>
              {chunks}
            </Link>
          ),
          version: () =>
            COMMIT_SHA ? (
              <>
                {' ('}
                <Link
                  className='Footer__revision'
                  href={`https://github.com/KittyGiraudel/ProMe/commit/${COMMIT_SHA}`}
                  target='_blank'
                  rel='noopener noreferrer'>
                  {COMMIT_SHA}
                </Link>
                {')'}
              </>
            ) : (
              ''
            ),
        })}
      </p>
    </div>
  )
}
