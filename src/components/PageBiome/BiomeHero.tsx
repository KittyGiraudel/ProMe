'use client'

import ArrowDownOutlined from '@ant-design/icons/lib/icons/ArrowDownOutlined'
import { useTranslations } from 'next-intl'
import { ViewTransition } from 'react'
import type { BiomeId } from '@/lib/types'

import './BiomeHero.css'

type Props = {
  biome: BiomeId
  bannerSrc: string | null
  index: number
}

export function BiomeHero({ biome, bannerSrc, index }: Props) {
  const t = useTranslations()

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
        <p className='BiomeHero__teaser'>{t(`biomes.${biome}.teaser`)}</p>
      </div>
      <p className='BiomeHero__scrollHint'>
        {t('common.actions.explore')} <ArrowDownOutlined />
      </p>
    </div>
  )
}
