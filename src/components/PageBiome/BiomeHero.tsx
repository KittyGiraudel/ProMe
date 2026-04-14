'use client'

import { useTranslations } from 'next-intl'
import type { BiomeId } from '@/lib/types'

type Props = {
  biome: BiomeId
  bannerSrc: string | null
}

export function BiomeHero({ biome, bannerSrc }: Props) {
  const t = useTranslations()
  const description = t(`biomes.${biome}.description`)
  // Use only the first sentence as the teaser.
  const teaser = description.split(/[.!?]\s/)[0] + '.'

  return (
    <div
      className='BiomeHero'
      style={
        { '--biome-hero-image': `url(${bannerSrc})` } as React.CSSProperties
      }>
      <div className='BiomeHero__overlay' />
      <div className='BiomeHero__content'>
        <p className='BiomeHero__eyebrow'>Biome</p>
        <h1 className='BiomeHero__title'>{t(`biomes.${biome}.title`)}</h1>
        <p className='BiomeHero__teaser'>{teaser}</p>
      </div>
      <p className='BiomeHero__scrollHint'>{t('common.actions.explore')} ↓</p>
    </div>
  )
}
