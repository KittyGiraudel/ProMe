import { copy } from '@/messages/fr'
import { countVillageGroupedEstablishmentRows } from '@/lib/village/groupEstablishments'
import { decodeVillageFactionParam } from '@/lib/village/villageFactionCodec'
import { countVillageEstablishments } from '@/lib/village/resolveDisplay'
import { decodeVillageRollParam } from '@/lib/village/villageUrlCodec'

export type VillageLinkSummaryOptions = {
  mergeDuplicateEstablishments?: boolean
}

function normalizeUrl(rawUrl: string): URL | null {
  try {
    return new URL(rawUrl)
  } catch {
    return null
  }
}

function isVillageGeneratorPath(pathname: string): boolean {
  return pathname.replace(/\/+$/, '') === '/generators/village'
}

export function getVillageSummaryFromUrl(
  rawUrl: string,
  options?: VillageLinkSummaryOptions
): string | null {
  const parsed = normalizeUrl(rawUrl)
  if (!parsed) return null
  if (!isVillageGeneratorPath(parsed.pathname)) return null

  const encodedRoll = parsed.searchParams.get('v')
  if (!encodedRoll) return null

  const roll = decodeVillageRollParam(encodedRoll)
  if (!roll) return null

  const faction = decodeVillageFactionParam(parsed.searchParams.get('f'))
  const factionLabel = faction ? copy.factions[faction] : null
  const count =
    options?.mergeDuplicateEstablishments === true
      ? countVillageGroupedEstablishmentRows(roll)
      : countVillageEstablishments(roll)
  return copy.village.linkSummary(factionLabel, count)
}
