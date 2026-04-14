import { useTranslations } from 'next-intl'
import { MapCover } from '@/components/MapCover/MapCover'
import { BiomeId } from '@/lib/types'
import { BiomeSection } from './BiomeSection'

import './BiomeMap.css'

export function BiomeMap({ biome }: { biome: BiomeId }) {
  const t = useTranslations()

  return (
    <BiomeSection
      title={t('characters.map.title')}
      className='BiomeMap'
      id='biome-map'>
      <div className='BiomeMap__cover'>
        <MapCover biome={biome} isCore={false} />
        <div className='BiomeMap__hex Pattern' data-biome={biome}></div>
      </div>
    </BiomeSection>
  )
}
