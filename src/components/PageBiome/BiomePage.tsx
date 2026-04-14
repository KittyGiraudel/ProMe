'use client'

import { Layout } from 'antd'
import { Footer } from '@/components/Footer/Footer'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { BIOME_IDS } from '@/constants/misc'
import { useApplyAppTheme } from '@/hooks/useApplyAppTheme'
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
import { useEffect } from 'react'

type Props = { biome: BiomeId }

export function BiomePage({ biome }: Props) {
  const index = BIOME_IDS.indexOf(biome)
  const { settings } = useSettings()

  useApplyAppTheme(settings.appearance.theme)
  useEffect(() => {
    document.documentElement.dataset.biome = biome
  }, [biome])

  return (
    <Layout className='BiomePage' data-biome={biome}>
      <BiomeHeader />
      <BiomeHero biome={biome} index={index} />
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
