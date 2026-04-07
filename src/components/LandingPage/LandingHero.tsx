'use client'

import { useTranslations } from 'next-intl'
import { Spiral } from '@/components/Spiral/Spiral'
import { Link } from '@/i18n/navigation'

import './LandingHero.css'
import { RichText } from '../RichText/RichText'

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
        <div className='LandingHero__divider' aria-hidden='true' />
        <p className='LandingHero__tagline'>{t('landing.hero.tagline')}</p>
        <Link href='/characters/new' className='LandingHero__cta'>
          {t('landing.hero.cta')}
        </Link>
        <span className='LandingHero__sub'>{t('landing.hero.sub')}</span>
      </div>
    </section>
  )
}
