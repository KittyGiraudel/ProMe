import { countVillageGroupedEstablishmentRows } from '@/lib/village/groupEstablishments'
import { decodeVillageIdRollParam } from '@/lib/village/villageIdCodec'
import { resolveVillageDisplay } from '@/lib/village/resolveVillageDisplay'
import type { Faction } from '@/lib/types'
import { _Translator } from 'next-intl'

/** Options for how village establishment rows are counted in summaries. */
export type VillageLinkSummaryOptions = {
  mergeDuplicateEstablishments?: boolean
}

/**
 * Short label for a village `[id]` path segment (roll + owners), e.g. for `{village/…}` tokens.
 * Optional `faction` only affects the displayed faction name, not roll decoding.
 */
export function getVillageJournalSummary(
  encodedVillageId: string,
  t: _Translator,
  options?: VillageLinkSummaryOptions,
  faction?: Faction | null
): string | null {
  const roll = decodeVillageIdRollParam(encodedVillageId.trim())
  if (!roll) return null

  const factionLabel = faction != null ? t(`common.factions.${faction}`) : null
  const count =
    options?.mergeDuplicateEstablishments === true
      ? countVillageGroupedEstablishmentRows(roll, t)
      : resolveVillageDisplay(roll, t).establishments.length
  return t('village.link_summary', {
    has_faction_label: factionLabel ? 'yes' : 'no',
    factionLabel: factionLabel ?? '',
    establishmentCount: count,
  })
}
