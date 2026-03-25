import { getAgeBand, getPersonality } from '@/lib/inhabitant/generate'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import { decodeInhabitantRollParam } from '@/lib/inhabitant/inhabitantUrlCodec'
import { _Translator } from 'next-intl'

function normalizeUrl(rawUrl: string): URL | null {
  try {
    return new URL(rawUrl)
  } catch {
    return null
  }
}

function isInhabitantGeneratorPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, '')
  return (
    normalized === '/generators/npc' ||
    normalized.startsWith('/generators/npc/')
  )
}

export function getInhabitantSummaryFromUrl(rawUrl: string, t: _Translator): string | null {
  const parsed = normalizeUrl(rawUrl)
  if (!parsed) return null
  if (!isInhabitantGeneratorPath(parsed.pathname)) return null

  const pathname = parsed.pathname.replace(/\/+$/, '')
  let encoded: string | null = null

  if (pathname.startsWith('/generators/npc/')) {
    // `/generators/npc/[id]` (id is the encoded compact roll)
    const parts = pathname.split('/').filter(Boolean)
    encoded = parts.length >= 3 ? parts[2]! : null
  } else {
    // Base `/generators/npc` has no encoded id.
    encoded = null
  }

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
