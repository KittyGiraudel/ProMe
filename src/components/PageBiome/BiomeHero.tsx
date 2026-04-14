'use client'

import { useTranslations } from 'next-intl'
import type { BiomeId } from '@/lib/types'

import './BiomeHero.css'
import ArrowDownOutlined from '@ant-design/icons/lib/icons/ArrowDownOutlined'

type Props = {
  biome: BiomeId
  bannerSrc: string | null
  index: number
}

export function BiomeHero({ biome, bannerSrc, index }: Props) {
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
        <p className='BiomeHero__eyebrow'>
          Biome {String(index + 1).padStart(2, '0')}
        </p>
        <h1 className='BiomeHero__title'>{t(`biomes.${biome}.title`)}</h1>
        <p className='BiomeHero__teaser'>{teaser}</p>
      </div>
      <p className='BiomeHero__scrollHint'>
        {t('common.actions.explore')} <ArrowDownOutlined />
      </p>
    </div>
  )
}
