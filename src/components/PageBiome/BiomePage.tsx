'use client'

import { Layout } from 'antd'
import { useEffect } from 'react'
import { Footer } from '@/components/Footer/Footer'
import { BIOME_IDS } from '@/constants/misc'
import type { BiomeId } from '@/lib/types'
import { BiomeAudio } from './BiomeAudio'
import { BiomeDescription } from './BiomeDescription'
import { BiomeEncounters } from './BiomeEncounters'
import { BiomeGathering } from './BiomeGathering'
import { BiomeHeader } from './BiomeHeader'
import { BiomeHero } from './BiomeHero'
import { BiomeMagic } from './BiomeMagic'
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
  const index = BIOME_IDS.indexOf(biome)

  useEffect(() => {
    const prev = document.documentElement.dataset.appTheme
    document.documentElement.dataset.appTheme = 'dark'
    document.body.dataset.biome = biome
    return () => {
      document.documentElement.dataset.appTheme = prev ?? ''
      document.body.dataset.biome = ''
    }
  }, [biome])

  return (
    <Layout className='BiomePage' data-biome={biome}>
      <BiomeHeader />
      <BiomeHero
        biome={biome}
        bannerSrc={BANNER_SRCS[biome] ?? null}
        index={index}
      />
      <Layout.Content className='BiomePage__content'>
        <BiomeDescription biome={biome} />
        <BiomeMagic biome={biome} />
        <BiomeAudio biome={biome} />
        <BiomeEncounters biome={biome} />
        <BiomeGathering biome={biome} />
        <BiomeMap biome={biome} />
      </Layout.Content>
      <Layout.Footer className='BiomePage__footer'>
        <Footer />
      </Layout.Footer>
    </Layout>
  )
}
