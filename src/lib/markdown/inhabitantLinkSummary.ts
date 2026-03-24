import { getAgeBand, getPersonality, type InhabitantRoll } from '@/lib/inhabitant/generate'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import { decodeInhabitantRollParam } from '@/lib/inhabitant/inhabitantUrlCodec'
import { copy } from '@/messages/fr'

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

export function formatInhabitantSummaryLabel(roll: InhabitantRoll): string {
  const age = getAgeBand(roll)
  const personality = getPersonality(roll)
  const g = genderCompactSymbol(roll.gender)
  return `${g} ${roll.name} (${copy.factions[roll.faction]}), ${copy.ageBands[age]} ${copy.personalities[personality]}`
}

export function getInhabitantSummaryFromUrl(rawUrl: string): string | null {
  const parsed = normalizeUrl(rawUrl)
  if (!parsed) return null
  if (!isInhabitantGeneratorPath(parsed.pathname)) return null

  const encoded = parsed.searchParams.get('i')
  if (!encoded) return null

  const roll = decodeInhabitantRollParam(encoded)
  if (!roll) return null

  return formatInhabitantSummaryLabel(roll)
}
