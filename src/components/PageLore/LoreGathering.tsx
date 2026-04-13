'use client'

import { useTranslations } from 'next-intl'
import { GATHERING_SCHEMA } from '@/lib/gathering/schema'
import type { BiomeId, TranslationKey } from '@/lib/types'

type Props = { biome: BiomeId }

const GATHER_KEYS = ['1', '2', '3', '4', '5', '6'] as const

export function LoreGathering({ biome }: Props) {
  const t = useTranslations()

  if (GATHERING_SCHEMA[biome] === null) return null

  // t.raw() returns the raw messages object for the namespace,
  // letting us check for optional hint/warning keys without throwing.
  const gatherMessages = t.raw(
    `common.gathering.${biome}` as TranslationKey
  ) as Record<string, string> | undefined
  const hint: string | undefined =
    gatherMessages?.hint ?? gatherMessages?.warning

  return (
    <section>
      <div className='LoreContent__sectionHead'>
        <h2 className='LoreContent__sectionLabel'>
          {t('characters.map.gathering_dialog_title')}
        </h2>
        <div className='LoreContent__sectionRule' />
      </div>
      <div className='LoreGathering__grid'>
        {GATHER_KEYS.map(key => (
          <div key={key} className='LoreGathering__item'>
            <span className='LoreGathering__die'>{key}</span>
            <span className='LoreGathering__value'>
              {t(`common.gathering.${biome}.${key}` as TranslationKey)}
            </span>
          </div>
        ))}
      </div>
      {hint && <p className='LoreGathering__hint'>{hint}</p>}
    </section>
  )
}
