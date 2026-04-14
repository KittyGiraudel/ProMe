import { useTranslations } from 'next-intl'
import { BiomeId } from '@/lib/types'
import { MapCover } from '../MapCover/MapCover'

export function BiomeMap({ biome }: { biome: BiomeId }) {
  const t = useTranslations()

  return (
    <section>
      <div className='BiomeContent__sectionHead'>
        <h2 className='BiomeContent__sectionLabel'>
          {t('characters.map.title')}
        </h2>
        <div className='BiomeContent__sectionRule' />
      </div>
      <div className='BiomeMapCover'>
        <MapCover biome={biome} isCore={false} />
      </div>
    </section>
  )
}
