'use client'

import { useTranslations } from 'next-intl'
import type { BiomeId } from '@/lib/types'
import { EncountersList } from '../EncountersList/EncountersList'

type Props = { biome: BiomeId }

export function LoreEncounters({ biome }: Props) {
  const t = useTranslations()

  return (
    <section>
      <div className='LoreContent__sectionHead'>
        <h2 className='LoreContent__sectionLabel'>
          {t('characters.map.encounters_dialog_title')}
        </h2>
        <div className='LoreContent__sectionRule' />
      </div>
      <div className='LoreEncounters__table'>
        <EncountersList biome={biome} />
      </div>
    </section>
  )
}
