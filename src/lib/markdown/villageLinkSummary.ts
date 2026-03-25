import { countVillageGroupedEstablishmentRows } from '@/lib/village/groupEstablishments'
import { decodeVillageFactionParam, decodeVillageRollParam } from '@/lib/village/villageUrlCodec'
import { Localize } from '../localization/localize'
import { resolveVillageDisplay } from '@/app/generators/village/useVillageGenerator'

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
  localize: Localize,
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
  const factionLabel = faction ? localize.string(`factions.${faction}`) : null
  const count =
    options?.mergeDuplicateEstablishments === true
      ? countVillageGroupedEstablishmentRows(roll, localize)
      : resolveVillageDisplay(roll, localize).establishments.length
  return localize.string('village.linkSummary', factionLabel, count)
}
