import { useTranslations } from 'next-intl'
import { BiomeId } from '@/lib/types'
import { MapCover } from '../MapCover/MapCover'

export function LoreMap({ biome }: { biome: BiomeId }) {
  const t = useTranslations()

  return (
    <section>
      <div className='LoreContent__sectionHead'>
        <h2 className='LoreContent__sectionLabel'>
          {t('characters.map.title')}
        </h2>
        <div className='LoreContent__sectionRule' />
      </div>
      <div className='LoreMapCover'>
        <MapCover biome={biome} isCore={false} />
      </div>
    </section>
  )
}
