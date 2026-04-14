'use client'

import { Layout } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Footer } from '@/components/Footer/Footer'
import type { BiomeId } from '@/lib/types'
import { BiomeAudio } from './BiomeAudio'
import { BiomeDescription } from './BiomeDescription'
import { BiomeEncounters } from './BiomeEncounters'
import { BiomeGathering } from './BiomeGathering'
import { BiomeHeader } from './BiomeHeader'
import { BiomeHero } from './BiomeHero'
import { BiomeMap } from './BiomeMap'

import './BiomePage.css'

const BANNER_SRCS: Partial<Record<BiomeId, string>> = {
  shadowForest: '/images/banner-shadowForest.avif',
  floodedPlains: '/images/banner-floodedPlains.avif',
  mushroomJungle: '/images/banner-mushroomJungle.avif',
  fieldSea: '/images/banner-fieldSea.avif',
  silentDesert: '/images/banner-silentDesert.avif',
  // titanGardens: no banner yet — hero uses CSS gradient fallback
}

type Props = { biome: BiomeId }

export function BiomePage({ biome }: Props) {
  const t = useTranslations()

  useEffect(() => {
    const prev = document.documentElement.dataset.appTheme
    document.documentElement.dataset.appTheme = 'dark'
    return () => {
      document.documentElement.dataset.appTheme = prev ?? ''
    }
  }, [])

  return (
    <Layout className='BiomePage' data-biome={biome}>
      <BiomeHeader />
      <BiomeHero biome={biome} bannerSrc={BANNER_SRCS[biome] ?? null} />
      <main className='BiomePage__content'>
        <BiomeDescription biome={biome} />
        <BiomeAudio biome={biome} />
        <BiomeEncounters biome={biome} />
        <BiomeGathering biome={biome} />
        <BiomeMap biome={biome} />
      </main>
      <Layout.Footer className='BiomePage__footer'>
        <Footer />
      </Layout.Footer>
    </Layout>
  )
}
