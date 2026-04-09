import { useTranslations } from 'next-intl'
import { CardCover } from '@/components/CardCover/CardCover'
import { PossibleBiomeId, TranslationKey } from '@/lib/types'

export function MapCover({
  biome,
  isCore,
}: {
  biome: PossibleBiomeId
  isCore: boolean
}) {
  const t = useTranslations()

  if (isCore) {
    return (
      <CardCover
        data-biome='unexplored'
        url='/images/banner-core.avif'
        title={t.rich('characters.map.location', {
          biome: () => <strong>{t('common.biomes.core')}</strong>,
        })}
        titleAs='h2'
      />
    )
  }

  return (
    <CardCover
      data-biome={biome}
      url={`/images/banner-${biome}.avif`}
      title={t.rich('characters.map.location', {
        biome: () => <strong>{t(`common.biomes.${biome}_with_prefix`)}</strong>,
      })}
      titleAs='h2'
      description={t(`common.biomes.${biome}_description` as TranslationKey)}
    />
  )
}
