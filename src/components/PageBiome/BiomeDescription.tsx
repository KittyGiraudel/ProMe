'use client'

import { useTranslations } from 'next-intl'
import { RichText } from '@/components/RichText/RichText'
import type { BiomeId } from '@/lib/types'
import { BiomeSection } from './BiomeSection'

import './BiomeDescription.css'

type Props = { biome: BiomeId }

export function BiomeDescription({ biome }: Props) {
  const t = useTranslations()

  return (
    <BiomeSection
      title={t('common.description')}
      className='BiomeDescription'
      id='biome-description'>
      <div className='BiomeDescription__text'>
        <RichText
          text={t(`biomes.${biome}.description`).replace(/\n/g, '  \n\n')}
        />
      </div>
    </BiomeSection>
  )
}
