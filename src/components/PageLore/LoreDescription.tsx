'use client'

import { useTranslations } from 'next-intl'
import type { BiomeId } from '@/lib/types'
import { RichText } from '../RichText/RichText'

type Props = { biome: BiomeId }

export function LoreDescription({ biome }: Props) {
  const t = useTranslations()

  return (
    <section>
      <div className='LoreContent__sectionHead'>
        <h2 className='LoreContent__sectionLabel'>{t('common.description')}</h2>
        <div className='LoreContent__sectionRule' />
      </div>
      <div className='LoreDescription__text'>
        <RichText
          text={t(`biomes.${biome}.description`).replace(/\n/g, '  \n\n')}
        />
      </div>
    </section>
  )
}
