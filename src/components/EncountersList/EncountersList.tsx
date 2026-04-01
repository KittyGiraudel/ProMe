import { useTranslations } from 'next-intl'
import type { BiomeId } from '@/lib/types'
import './EncountersList.css'
import { RichText } from '../RichText/RichText'

const ROLLS = ['1', '2', '3', '4', '5', '6'] as const

export function EncountersList({ biome }: { biome: BiomeId }) {
  const t = useTranslations()

  return (
    <ol className='EncountersList'>
      {ROLLS.map(roll => (
        <li key={roll} className='EncountersList__item'>
          <RichText text={t(`common.encounters.${biome}.${roll}`)} />
        </li>
      ))}
    </ol>
  )
}
