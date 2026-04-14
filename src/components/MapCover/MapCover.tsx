import { useTranslations } from 'next-intl'
import { CardCover } from '@/components/CardCover/CardCover'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { PossibleBiomeId } from '@/lib/types'

import './MapCover.css'
import ArrowRightOutlined from '@ant-design/icons/lib/icons/ArrowRightOutlined'
import { biomeIdToSlug } from '@/lib/biomes/biomeSlug'
import { BlockedLink } from '../Navigation/BlockedLink'

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
        b: chunks =>
          biome !== 'unexplored' ? (
            <BlockedLink
              className='MapCover__link'
              href={`/biomes/${biomeIdToSlug(biome)}`}>
              {chunks}
            </BlockedLink>
          ) : (
            <strong>{chunks}</strong>
          ),
      })}
      titleAs='h2'
      description={
        biome !== 'unexplored' ? (
          <>
            {t(`biomes.${biome}.teaser`)} ·{' '}
            <BlockedLink
              className='MapCover__link MapCover__link--in-text'
              href={`/biomes/${biomeIdToSlug(biome)}`}>
              {t('common.actions.explore')} <ArrowRightOutlined />
            </BlockedLink>
          </>
        ) : undefined
      }
    />
  )
}
