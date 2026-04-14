'use client'

import { useTranslations } from 'next-intl'
import { EncountersList } from '@/components/EncountersList/EncountersList'
import type { BiomeId } from '@/lib/types'
import { BiomeSection } from './BiomeSection'

import './BiomeEncounters.css'

type Props = { biome: BiomeId }

export function BiomeEncounters({ biome }: Props) {
  const t = useTranslations()

  return (
    <BiomeSection
      title={t('characters.map.encounters_dialog_title')}
      className='BiomeEncounters'
      id='biome-encounters'>
      <div className='BiomeEncounters__table'>
        <EncountersList biome={biome} />
      </div>
    </BiomeSection>
  )
}
