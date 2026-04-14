import { useTranslations } from 'next-intl'
import { RichText } from '@/components/RichText/RichText'
import { DICE } from '@/constants/misc'
import type { BiomeId, TranslationKey } from '@/lib/types'

import './EncountersList.css'

export function EncountersList({ biome }: { biome: BiomeId }) {
  const t = useTranslations()

  return (
    <ol className='EncountersList'>
      {Array.from({ length: 6 }).map((_, zeroIndex) => {
        const oneIndex = zeroIndex + 1
        const key = `common.encounters.${biome}.${oneIndex}` as TranslationKey
        const mergedKey =
          `common.encounters.${biome}.${oneIndex}|${oneIndex + 1}` as TranslationKey
        const face = DICE[zeroIndex]

        if (t.has(mergedKey)) {
          return (
            <li
              key={mergedKey}
              className='EncountersList__item'
              data-index={`${face} ${DICE[zeroIndex + 1]}`}>
              <RichText text={t(mergedKey).replace(/\n/g, '  \n')} />
            </li>
          )
        } else if (t.has(key)) {
          return (
            <li key={key} className='EncountersList__item' data-index={face}>
              <RichText text={t(key).replace(/\n/g, '  \n')} />
            </li>
          )
        }

        return null
      })}
    </ol>
  )
}
