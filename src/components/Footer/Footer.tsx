'use client'

import { useTranslations } from 'next-intl'
import { Logo } from '@/components/Logo/Logo'
import { AppLink } from '@/components/Navigation/AppLink'

import './Footer.css'

const COMMIT_SHA = process.env.NEXT_PUBLIC_COMMIT_SHA

export function Footer() {
  const t = useTranslations()

  return (
    <div className='Footer'>
      <div className='Footer__inner'>
        <div className='Footer__brand'>
          <AppLink to={{ route: 'home' }} block className='Footer__logo-link'>
            <Logo />
          </AppLink>
          <p className='Footer__description'>{t('footer.description')}</p>
        </div>

        <nav className='Footer__nav'>
          <AppLink to={{ route: 'about' }} block className='Footer__nav-link'>
            {t('nav.about')}
          </AppLink>
          <AppLink to={{ route: 'faq' }} block className='Footer__nav-link'>
            {t('nav.faq')}
          </AppLink>
          <AppLink to={{ route: 'privacy' }} block className='Footer__nav-link'>
            {t('nav.privacy')}
          </AppLink>
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
        <p className='Footer__copyright'>
          {t.rich('footer.copyright', {
            link: chunks => (
              <a
                href='https://bsky.app/profile/desesperenzo.bsky.social'
                target='_blank'
                rel='noopener noreferrer'>
                {chunks}
              </a>
            ),
          })}
        </p>
        <p className='Footer__credit'>
          {t.rich('footer.application', {
            link_author: chunks => (
              <a
                href='https://kittygiraudel.com'
                target='_blank'
                rel='noopener noreferrer'>
                {chunks}
              </a>
            ),
            version: () =>
              COMMIT_SHA ? (
                <>
                  {' ('}
                  <a
                    className='Footer__revision'
                    href={`https://github.com/KittyGiraudel/ProMe/commit/${COMMIT_SHA}`}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {COMMIT_SHA}
                  </a>
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
