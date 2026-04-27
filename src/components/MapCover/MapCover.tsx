import ArrowRightOutlined from '@ant-design/icons/lib/icons/ArrowRightOutlined'
import { useLocale, useTranslations } from 'next-intl'
import { ViewTransition } from 'react'
import { CardCover } from '@/components/CardCover/CardCover'
import { AppLink } from '@/components/Navigation/AppLink'
import { biomeIdToSlug } from '@/lib/biomes/biomeSlug'
import { PossibleBiomeId } from '@/lib/types'

import './MapCover.css'

export function MapCover({
  biome,
  isCore,
}: {
  biome: PossibleBiomeId
  isCore: boolean
}) {
  const t = useTranslations()
  const locale = useLocale()

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
              <AppLink
                className='MapCover__link'
                to={{
                  route: 'biome',
                  params: { biome: biomeIdToSlug(biome, locale) },
                  hash: 'biome-map',
                }}
                block>
                {chunks}
              </AppLink>
            ) : (
              <strong>{chunks}</strong>
            ),
        })}
        titleAs='p'
        description={
          biome !== 'unexplored' ? (
            <>
              {t(`biomes.${biome}.teaser`)} ·{' '}
              <AppLink
                className='MapCover__link MapCover__link--in-text'
                to={{
                  route: 'biome',
                  params: { biome: biomeIdToSlug(biome, locale) },
                  hash: 'biome-map',
                }}
                block>
                {t('common.actions.explore')} <ArrowRightOutlined />
              </AppLink>
            </>
          ) : undefined
        }
      />
    </ViewTransition>
  )
}
