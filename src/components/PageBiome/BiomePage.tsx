'use client'

import { ConfigProvider, Layout } from 'antd'
import { useEffect } from 'react'
import { useAntPalette } from '@/components/AppProviders/ThemeProvider'
import { Footer } from '@/components/Footer/Footer'
import { useSettings } from '@/components/PageSettings/SettingsContext'
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

type Props = { biome: BiomeId }

export function BiomePage({ biome }: Props) {
  const index = BIOME_IDS.indexOf(biome)
  const { settings } = useSettings()
  const theme = settings.appearance.theme

  useEffect(() => {
    const prev = document.documentElement.dataset.appTheme
    document.documentElement.dataset.appTheme = theme
    document.body.dataset.biome = biome
    return () => {
      document.documentElement.dataset.appTheme = prev ?? ''
      document.body.dataset.biome = ''
    }
  }, [biome, theme])

  const antTheme = useAntPalette(theme)

  return (
    <ConfigProvider theme={antTheme}>
      <Layout className='BiomePage' data-biome={biome} data-biome-theme={theme}>
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
    </ConfigProvider>
  )
}
