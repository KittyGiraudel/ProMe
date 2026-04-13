'use client'

import { useTranslations } from 'next-intl'
import type { BiomeId } from '@/lib/types'

type Props = {
  biome: BiomeId
  bannerSrc: string | null
}

export function LoreHero({ biome, bannerSrc }: Props) {
  const t = useTranslations()
  const description = t(`biomes.${biome}.description`)
  // Use only the first sentence as the teaser.
  const teaser = description.split(/[.!?]\s/)[0] + '.'

  return (
    <div
      className='LoreHero'
      style={
        { '--lore-hero-image': `url(${bannerSrc})` } as React.CSSProperties
      }>
      <div className='LoreHero__overlay' />
      <div className='LoreHero__content'>
        <p className='LoreHero__eyebrow'>Biome</p>
        <h1 className='LoreHero__title'>{t(`biomes.${biome}.title`)}</h1>
        <p className='LoreHero__teaser'>{teaser}</p>
      </div>
      <p className='LoreHero__scrollHint'>{t('common.actions.explore')} ↓</p>
    </div>
  )
}
