import { getAgeBand, getPersonality, type InhabitantRoll } from '@/lib/inhabitant/generate'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import { decodeInhabitantRollParam } from '@/lib/inhabitant/inhabitantUrlCodec'
import { Localize } from '../localization/localize'

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

export function getInhabitantSummaryFromUrl(rawUrl: string, localize: Localize): string | null {
  const parsed = normalizeUrl(rawUrl)
  if (!parsed) return null
  if (!isInhabitantGeneratorPath(parsed.pathname)) return null

  const encoded = parsed.searchParams.get('i')
  if (!encoded) return null

  const roll = decodeInhabitantRollParam(encoded, localize)
  if (!roll) return null

  return localize.string('inhabitant.oneLiner', {
    gender: genderCompactSymbol(roll.gender),
    name: roll.name, 
    faction: localize.string(`factions.${roll.faction}`),
    age: localize.string(`ageBands.${getAgeBand(roll)}`),
    personality: localize.string(`personalities.${getPersonality(roll)}`)
  })
}
