import { copy } from '@/messages/fr'
import type { PlayingCard } from '@/lib/types'
import { suitIsRed } from '@/lib/suitGlyphs'
import {
  establishmentLineFromSizeTier,
  rankUsesEstablishmentSizeTiers,
} from '@/lib/village/data/establishments'
import type { VillageRoll } from '@/lib/village/generate'
import { mergeEstablishmentSizeTiers } from '@/lib/village/mergeEstablishmentSizeTiers'
import type { VillageEstablishmentRow } from '@/lib/village/resolveDisplay'
import { resolveVillageDisplay } from '@/lib/village/resolveDisplay'

export type VillageEstablishmentGroup = {
  key: string
  text: string
  count: number
  card: PlayingCard
  rerollPrimarySlot: number | null
  rulebookPages: number[]
  ownerIndices: number[]
}

export function groupEstablishments(
  rows: VillageEstablishmentRow[]
): VillageEstablishmentGroup[] {
  const order: string[] = []
  const map = new Map<
    string,
    { rows: VillageEstablishmentRow[]; ownerIndices: number[] }
  >()
  rows.forEach((r, idx) => {
    const tiered = rankUsesEstablishmentSizeTiers(r.card.rank)
    const key = tiered ? `tier:${r.card.rank}` : `plain:${r.text}`
    const cur = map.get(key)
    if (!cur) {
      map.set(key, { rows: [r], ownerIndices: [idx] })
      order.push(key)
    } else {
      cur.rows.push(r)
      cur.ownerIndices.push(idx)
    }
  })
  return order.map(key => {
    const { rows: groupRows, ownerIndices } = map.get(key)!
    const count = groupRows.length
    const first = groupRows[0]!
    let text: string
    if (key.startsWith('tier:')) {
      const tiers = groupRows.map(rr =>
        (suitIsRed(rr.card.suit) ? 2 : 1) as 1 | 2
      )
      const merged = mergeEstablishmentSizeTiers(tiers)
      text = establishmentLineFromSizeTier(first.card.rank, merged)
    } else {
      const baseText = first.text
      if (count === 1) {
        text = baseText
      } else if (count === 2) {
        text = `${copy.village.mergedEstablishmentLabel}${copy.common.emDashSpaced}${baseText}`
      } else {
        text = `${copy.village.mergedEstablishmentLabel} (×${count})${copy.common.emDashSpaced}${baseText}`
      }
    }
    const slots = groupRows.flatMap(rr =>
      rr.rerollPrimarySlot != null ? [rr.rerollPrimarySlot] : []
    )
    const rulebookPages: number[] = []
    for (const rr of groupRows) {
      if (!rulebookPages.includes(rr.rulebookPage)) {
        rulebookPages.push(rr.rulebookPage)
      }
    }
    rulebookPages.sort((a, b) => a - b)
    const rerollPrimarySlot =
      count === 1 && slots.length === 1 ? slots[0]! : null
    return {
      key,
      text,
      count,
      card: first.card,
      rerollPrimarySlot,
      rulebookPages,
      ownerIndices,
    }
  })
}

/** Establishment line count when duplicate rows are merged (same rules as the village summary). */
export function countVillageGroupedEstablishmentRows(roll: VillageRoll): number {
  const { establishments } = resolveVillageDisplay(roll)
  return groupEstablishments(establishments).length
}
