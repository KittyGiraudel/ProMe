'use client'

import { useTranslations } from 'next-intl'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import './LandingHero.css'

export function LandingHero() {
  const t = useTranslations()

  return (
    <section className='LandingHero'>
      <div className='LandingHero__content'>
        <p className='LandingHero__eyebrow'>{t('landing.hero.eyebrow')}</p>
        <h1 className='LandingHero__title'>{t('landing.hero.title')}</h1>
        <div className='LandingHero__divider' aria-hidden='true' />
        <p className='LandingHero__tagline'>{t('landing.hero.tagline')}</p>
        <BlockedLink href='/characters/new' className='LandingHero__cta'>
          {t('landing.hero.cta')}
        </BlockedLink>
        <span className='LandingHero__sub'>{t('landing.hero.sub')}</span>
      </div>
    </section>
  )
}
