'use client'

import { useTranslations } from 'next-intl'
import type { BiomeId } from '@/lib/types'
import { EncountersList } from '../EncountersList/EncountersList'

type Props = { biome: BiomeId }

export function BiomeEncounters({ biome }: Props) {
  const t = useTranslations()

  return (
    <section>
      <div className='BiomeContent__sectionHead'>
        <h2 className='BiomeContent__sectionLabel'>
          {t('characters.map.encounters_dialog_title')}
        </h2>
        <div className='BiomeContent__sectionRule' />
      </div>
      <div className='BiomeEncounters__table'>
        <EncountersList biome={biome} />
      </div>
    </section>
  )
}
