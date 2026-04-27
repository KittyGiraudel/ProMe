'use client'

import { useTranslations } from 'next-intl'
import { AppLink } from '@/components/Navigation/AppLink'
import { Spiral } from '@/components/Spiral/Spiral'
import { RichText } from '../RichText/RichText'

import './LandingHero.css'

export function LandingHero() {
  const t = useTranslations()

  return (
    <section className='LandingHero'>
      <Spiral />
      <div className='LandingHero__content'>
        <div className='LandingHero__eyebrow'>
          <RichText text={t('landing.hero.eyebrow')} />
        </div>
        <h1 className='LandingHero__title'>{t('landing.hero.title')}</h1>
        <div className='LandingHero__divider' />
        <p className='LandingHero__tagline'>{t('landing.hero.tagline')}</p>
        <AppLink to={{ route: 'newCharacter' }} className='LandingHero__cta'>
          {t('landing.hero.cta')}
        </AppLink>
        <span className='LandingHero__sub'>{t('landing.hero.sub')}</span>
      </div>
    </section>
  )
}
