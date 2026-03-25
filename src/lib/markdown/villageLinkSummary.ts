import { countVillageGroupedEstablishmentRows } from '@/lib/village/groupEstablishments'
import { decodeVillageIdRollParam } from '@/lib/village/villageIdCodec'
import { resolveVillageDisplay } from '@/lib/village/resolveVillageDisplay'
import { parseGeneratorLink } from '@/lib/markdown/generatorLink'
import { _Translator } from 'next-intl'

/**
 * Options controlling how village links are summarized in journal markdown.
 */
export type VillageLinkSummaryOptions = {
  mergeDuplicateEstablishments?: boolean
}

/**
 * If `rawUrl` is a village share URL, return a short human-friendly summary label
 * suitable for rendering inline in markdown (journal link previews).
 *
 * Decoding strategy:
 * - Extract the `[id]` path segment and decode only the roll portion of it.
 * - Use the decoded roll to compute establishment counts (optionally grouped).
 * - Read `?f=` (if present) only to display the faction label; it does not affect
 *   roll decoding.
 *
 * Returns `null` when:
 * - the URL is not a village generator link
 * - the encoded id is missing
 * - roll decoding fails
 */
export function getVillageSummaryFromUrl(
  rawUrl: string,
  t: _Translator,
  options?: VillageLinkSummaryOptions
): string | null {
  const parsed = parseGeneratorLink(rawUrl)
  if (!parsed || parsed.kind !== 'village') return null

  const roll = decodeVillageIdRollParam(parsed.encodedId)
  if (!roll) return null

  const factionLabel = parsed.faction ? t(`common.factions.${parsed.faction}`) : null
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
