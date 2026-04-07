'use client'

import { useTranslations } from 'next-intl'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { useFadeIn } from './useFadeIn'
import './LandingFinalCta.css'

export function LandingFinalCta() {
  const t = useTranslations()
  const ref = useFadeIn()

  return (
    <section className='LandingFinalCta'>
      <div ref={ref} className='LandingFinalCta__content'>
        <h2 className='LandingFinalCta__title'>
          {t('landing.final_cta.title')}
        </h2>
        <p className='LandingFinalCta__sub'>{t('landing.final_cta.sub')}</p>
        <BlockedLink href='/characters/new' className='LandingFinalCta__cta'>
          {t('landing.final_cta.cta')}
        </BlockedLink>
      </div>
    </section>
  )
}
