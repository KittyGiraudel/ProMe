import { getAgeBand, getPersonality, type InhabitantRoll } from '@/lib/inhabitant/generate'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import { decodeInhabitantRollParam } from '@/lib/inhabitant/inhabitantUrlCodec'
import { Localize } from '../localization/localize'
import { _Translator } from 'next-intl'

function normalizeUrl(rawUrl: string): URL | null {
  try {
    return new URL(rawUrl)
  } catch {
    return null
  }
}

function isInhabitantGeneratorPath(pathname: string): boolean {
  return pathname.replace(/\/+$/, '') === '/generators/inhabitant'
}

export function getInhabitantSummaryFromUrl(rawUrl: string, t: _Translator): string | null {
  const parsed = normalizeUrl(rawUrl)
  if (!parsed) return null
  if (!isInhabitantGeneratorPath(parsed.pathname)) return null

  const encoded = parsed.searchParams.get('i')
  if (!encoded) return null

  const roll = decodeInhabitantRollParam(encoded, t)
  if (!roll) return null

  return t('inhabitant.one_liner', {
    gender: genderCompactSymbol(roll.gender),
    name: roll.name, 
    faction: t(`common.factions.${roll.faction}`),
    age: t(`common.age_bands.${getAgeBand(roll)}`),
    personality: t(`common.personalities.${getPersonality(roll)}`)
  })
}
