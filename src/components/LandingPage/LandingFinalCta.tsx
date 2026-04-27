'use client'

import { useTranslations } from 'next-intl'
import { AppLink } from '@/components/Navigation/AppLink'

import './LandingFinalCta.css'

export function LandingFinalCta() {
  const t = useTranslations()

  return (
    <section className='LandingFinalCta'>
      <div className='LandingFinalCta__content'>
        <h2 className='LandingFinalCta__title'>
          {t('landing.final_cta.title')}
        </h2>
        <p className='LandingFinalCta__sub'>{t('landing.final_cta.sub')}</p>
        <AppLink
          to={{ route: 'newCharacter' }}
          className='LandingFinalCta__cta'>
          {t('landing.final_cta.cta')}
        </AppLink>
      </div>
    </section>
  )
}
