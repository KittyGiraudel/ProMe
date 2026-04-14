'use client'

import { useTranslations } from 'next-intl'
import { SpiralSearch } from '@/components/SpiralSearch/SpiralSearch'
import type { BiomeId } from '@/lib/types'
import { BiomeSection } from './BiomeSection'

import './BiomeMagic.css'

type Props = { biome: BiomeId }

export function BiomeMagic({ biome }: Props) {
  const t = useTranslations()

  return (
    <BiomeSection
      title={t('common.magic')}
      className='BiomeMagic'
      id='biome-magic'>
      <div>
        <p>La Magie de ce biome doit répondre à la question suivante :</p>
        <div className='BiomeMagic__quote'>
          <blockquote className='BiomeMagic__text'>
            <SpiralSearch />
            <q>{t(`biomes.${biome}.magic`)}</q>
          </blockquote>
        </div>
      </div>
    </BiomeSection>
  )
}
