import ArrowRightOutlined from '@ant-design/icons/lib/icons/ArrowRightOutlined'
import { useTranslations } from 'next-intl'
import { ViewTransition } from 'react'
import { CardCover } from '@/components/CardCover/CardCover'
import { biomeIdToSlug } from '@/lib/biomes/biomeSlug'
import { PossibleBiomeId } from '@/lib/types'
import { BlockedLink } from '../Navigation/BlockedLink'

import './MapCover.css'

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
        className='MapCover'
        data-biome='unexplored'
        image='url("/images/banner-core.avif")'
        title={t.rich(`biomes.${biome}.location`, {
          b: chunks => <strong>{chunks}</strong>,
        })}
        titleAs='p'
      />
    )
  }

  return (
    <ViewTransition name={`biome-banner-${biome}`}>
      <CardCover
        className='MapCover'
        data-biome={biome}
        image='var(--biome-image)'
        title={t.rich(`biomes.${biome}.location`, {
          b: chunks =>
            biome !== 'unexplored' ? (
              <BlockedLink
                className='MapCover__link'
                href={`/biomes/${biomeIdToSlug(biome)}#biome-map`}>
                {chunks}
              </BlockedLink>
            ) : (
              <strong>{chunks}</strong>
            ),
        })}
        titleAs='p'
        description={
          biome !== 'unexplored' ? (
            <>
              {t(`biomes.${biome}.teaser`)} ·{' '}
              <BlockedLink
                className='MapCover__link MapCover__link--in-text'
                href={`/biomes/${biomeIdToSlug(biome)}#biome-map`}>
                {t('common.actions.explore')} <ArrowRightOutlined />
              </BlockedLink>
            </>
          ) : undefined
        }
      />
    </ViewTransition>
  )
}
