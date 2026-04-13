'use client'

import { Layout } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Footer } from '@/components/Footer/Footer'
import type { BiomeId } from '@/lib/types'
import { LoreDescription } from './LoreDescription'
import { LoreEncounters } from './LoreEncounters'
import { LoreGathering } from './LoreGathering'
import { LoreHeader } from './LoreHeader'
import { LoreHero } from './LoreHero'

import './LorePage.css'
import { MapCover } from '../MapCover/MapCover'
import { LoreAudio } from './LoreAudio'
import { LoreMap } from './LoreMap'

const BANNER_SRCS: Partial<Record<BiomeId, string>> = {
  shadowForest: '/images/banner-shadowForest.avif',
  floodedPlains: '/images/banner-floodedPlains.avif',
  mushroomJungle: '/images/banner-mushroomJungle.avif',
  fieldSea: '/images/banner-fieldSea.avif',
  silentDesert: '/images/banner-silentDesert.avif',
  // titanGardens: no banner yet — hero uses CSS gradient fallback
}

type Props = { biome: BiomeId }

export function LorePage({ biome }: Props) {
  const t = useTranslations()

  useEffect(() => {
    const prev = document.documentElement.dataset.appTheme
    document.documentElement.dataset.appTheme = 'dark'
    return () => {
      document.documentElement.dataset.appTheme = prev ?? ''
    }
  }, [])

  return (
    <Layout className='LorePage' data-biome={biome}>
      <LoreHeader />
      <LoreHero biome={biome} bannerSrc={BANNER_SRCS[biome] ?? null} />
      <main className='LoreContent'>
        <LoreDescription biome={biome} />
        <LoreAudio biome={biome} />
        <LoreEncounters biome={biome} />
        <LoreGathering biome={biome} />
        <LoreMap biome={biome} />
      </main>
      <Layout.Footer className='LorePage__footer'>
        <Footer />
      </Layout.Footer>
    </Layout>
  )
}
