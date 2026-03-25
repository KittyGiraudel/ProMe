import { countVillageGroupedEstablishmentRows } from '@/lib/village/groupEstablishments'
import { decodeVillageFactionParam } from '@/lib/village/villageUrlCodec'
import { decodeVillageIdRollParam } from '@/lib/village/villageIdCodec'
import { resolveVillageDisplay } from '@/lib/village/resolveVillageDisplay'
import { _Translator } from 'next-intl'

/**
 * Options controlling how village links are summarized in journal markdown.
 */
export type VillageLinkSummaryOptions = {
  mergeDuplicateEstablishments?: boolean
}

/**
 * Best-effort URL parsing for journal markdown links.
 *
 * Returns `null` for invalid URLs rather than throwing, since journal content may
 * contain arbitrary text.
 */
function normalizeUrl(rawUrl: string): URL | null {
  try {
    return new URL(rawUrl)
  } catch {
    return null
  }
}

/**
 * True when the URL pathname points to the village generator route.
 *
 * Supported route shape:
 * - `/generators/village/<id>` where `<id>` is the village `[id]` segment
 */
function isVillageGeneratorPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, '')
  return normalized.startsWith('/generators/village/')
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
  const parsed = normalizeUrl(rawUrl)
  if (!parsed) return null
  if (!isVillageGeneratorPath(parsed.pathname)) return null

  const segments = parsed.pathname.replace(/\/+$/, '').split('/').filter(Boolean)
  // Expected: /generators/village/[id]
  const encodedId = segments.length >= 3 ? segments[2]! : null
  if (!encodedId) return null

  const roll = decodeVillageIdRollParam(encodedId)
  if (!roll) return null

  const faction = decodeVillageFactionParam(parsed.searchParams.get('f'))
  const factionLabel = faction ? t(`common.factions.${faction}`) : null
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
