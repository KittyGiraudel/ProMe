'use client'

import { useTranslations } from 'next-intl'
import type { BiomeId } from '@/lib/types'
import { RichText } from '../RichText/RichText'

type Props = { biome: BiomeId }

export function BiomeDescription({ biome }: Props) {
  const t = useTranslations()

  return (
    <section>
      <div className='BiomeContent__sectionHead'>
        <h2 className='BiomeContent__sectionLabel'>
          {t('common.description')}
        </h2>
        <div className='BiomeContent__sectionRule' />
      </div>
      <div className='BiomeDescription__text'>
        <RichText
          text={t(`biomes.${biome}.description`).replace(/\n/g, '  \n\n')}
        />
      </div>
    </section>
  )
}
