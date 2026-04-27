'use client'

import { useTranslations } from 'next-intl'
import { Logo } from '@/components/Logo/Logo'
import { Link } from '@/i18n/navigation'

import './Footer.css'

const COMMIT_SHA = process.env.NEXT_PUBLIC_COMMIT_SHA

export function Footer() {
  const t = useTranslations()

  return (
    <div className='Footer'>
      <div className='Footer__inner'>
        <div className='Footer__brand'>
          <Link href='/' className='Footer__logo-link'>
            <Logo />
          </Link>
          <p className='Footer__description'>{t('footer.description')}</p>
        </div>

        <nav className='Footer__nav'>
          <Link href='/about' className='Footer__nav-link'>
            {t('nav.about')}
          </Link>
          <Link href='/faq' className='Footer__nav-link'>
            {t('nav.faq')}
          </Link>
          <Link href='/privacy' className='Footer__nav-link'>
            {t('nav.privacy')}
          </Link>
          <a
            href='https://github.com/KittyGiraudel/ProMe/issues'
            target='_blank'
            rel='noopener noreferrer'
            className='Footer__nav-link'>
            GitHub
          </a>
        </nav>
      </div>
      <div className='Footer__colophon'>
        <p className='Footer__copyright'>{t('footer.copyright')}</p>
        <p className='Footer__credit'>
          {t.rich('footer.application', {
            link_author: chunks => (
              <Link
                href='https://kittygiraudel.com'
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
    </div>
  )
}
