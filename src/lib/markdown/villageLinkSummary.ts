import { countVillageGroupedEstablishmentRows } from '@/lib/village/groupEstablishments'
import { decodeVillageFactionParam, decodeVillageRollParam } from '@/lib/village/villageUrlCodec'
import { resolveVillageDisplay } from '@/app/[locale]/generators/village/useVillageGenerator'
import { _Translator } from 'next-intl'

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
  t: _Translator,
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
  const factionLabel = faction ? t(`common.factions.${faction}`) : null
  const count =
    options?.mergeDuplicateEstablishments === true
      ? countVillageGroupedEstablishmentRows(roll, t)
      : resolveVillageDisplay(roll, t).establishments.length
  return t('village.linkSummary', factionLabel, count)
}
