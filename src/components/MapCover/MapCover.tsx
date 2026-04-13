import { useTranslations } from 'next-intl'
import { CardCover } from '@/components/CardCover/CardCover'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { PossibleBiomeId, TranslationKey } from '@/lib/types'

import './MapCover.css'

export function MapCover({
  biome,
  isCore,
}: {
  biome: PossibleBiomeId
  isCore: boolean
}) {
  const t = useTranslations()
  const { settings } = useSettings()

  if (!settings.appearance.showImagery) {
    return null
  }

  if (isCore) {
    return (
      <CardCover
        className='MapCover'
        data-biome='unexplored'
        url='/images/banner-core.avif'
        title={t.rich('characters.map.location_core', {
          b: chunks => <strong>{chunks}</strong>,
        })}
        titleAs='h2'
      />
    )
  }

  return (
    <CardCover
      className='MapCover'
      data-biome={biome}
      url={`/images/banner-${biome}.avif`}
      title={t.rich(`characters.map.location_${biome}`, {
        b: chunks => <strong>{chunks}</strong>,
      })}
      titleAs='h2'
      description={t(`common.biomes.${biome}_description` as TranslationKey)}
    />
  )
}
