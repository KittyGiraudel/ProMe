import { useTranslations } from 'next-intl'
import { ViewTransition } from 'react'
import { MapCover } from '@/components/MapCover/MapCover'
import { BiomeId } from '@/lib/types'
import { BiomeSection } from './BiomeSection'

import './BiomeMap.css'

export function BiomeMap({ biome }: { biome: BiomeId }) {
  const t = useTranslations()

  return (
    <ViewTransition name={`biome-banner-${biome}`} share='morph'>
      <BiomeSection
        title={t('characters.map.title')}
        className='BiomeMap'
        id='biome-map'>
        <div className='BiomeMap__cover'>
          <MapCover biome={biome} isCore={false} withViewTransition={false} />
          <div className='BiomeMap__hex Pattern' data-biome={biome}></div>
        </div>
      </BiomeSection>
    </ViewTransition>
  )
}
