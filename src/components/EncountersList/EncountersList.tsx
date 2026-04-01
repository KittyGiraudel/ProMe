import { useTranslations } from 'next-intl'
import type { BiomeId } from '@/lib/types'
import './EncountersList.css'
import { RichText } from '../RichText/RichText'

const ROLLS = ['1', '2', '3', '4', '5', '6'] as const

export function EncountersList({ biome }: { biome: BiomeId }) {
  const t = useTranslations()

  return (
    <ol className='EncountersList'>
      {ROLLS.map((roll, index, array) => {
        const description = t(`common.encounters.${biome}.${roll}`)
        const previousDescription = array[index - 1]
          ? t(`common.encounters.${biome}.${array[index - 1]}`)
          : undefined
        const nextDescription = array[index + 1]
          ? t(`common.encounters.${biome}.${array[index + 1]}`)
          : undefined
        const isSameAsPrevious = description === previousDescription
        const isSameAsNext = description === nextDescription

        return description === previousDescription ? null : (
          <li
            key={roll}
            className='EncountersList__item'
            data-index={isSameAsNext ? `${index + 1} ${index + 2}` : index + 1}>
            <RichText text={description.replace(/\n/g, '  \n')} />
          </li>
        )
      })}
    </ol>
  )
}
