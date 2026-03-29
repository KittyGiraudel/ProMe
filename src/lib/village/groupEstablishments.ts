import { _Translator } from 'next-intl'
import { suitIsRed } from '@/lib/suitGlyphs'
import type { PlayingCard } from '@/lib/types'
import { rankUsesEstablishmentSizeTiers } from '@/lib/village/data/establishments'
import type { VillageRoll } from '@/lib/village/generate'
import { mergeEstablishmentSizeTiers } from '@/lib/village/mergeEstablishmentSizeTiers'
import {
  resolveVillageDisplay,
  type VillageEstablishmentRow,
} from '@/lib/village/resolveVillageDisplay'

export type VillageEstablishmentGroup = {
  key: string
  text: string
  count: number
  card: PlayingCard
  rerollPrimarySlot: number | null
  /** Indices into the original (un-grouped) establishment rows array. */
  ownerIndices: number[]
}

export function groupEstablishments(
  rows: VillageEstablishmentRow[],
  t: _Translator
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
    let text = first.text

    if (key.startsWith('tier:')) {
      const tiers = groupRows.map(rr => (suitIsRed(rr.card.suit) ? 2 : 1))
      const merged = mergeEstablishmentSizeTiers(tiers)
      text = t(`village.establishments.${first.card.rank}`, {
        size: merged - 1,
      })
    }

    const slots = groupRows.flatMap(rr =>
      rr.rerollPrimarySlot != null ? [rr.rerollPrimarySlot] : []
    )
    const rerollPrimarySlot =
      count === 1 && slots.length === 1 ? slots[0]! : null
    return {
      key,
      text,
      count,
      card: first.card,
      rerollPrimarySlot,
      ownerIndices,
    }
  })
}

/** Establishment line count when duplicate rows are merged (same rules as the village summary). */
export function countVillageGroupedEstablishmentRows(
  roll: VillageRoll,
  t: _Translator
): number {
  const { establishments } = resolveVillageDisplay(roll, t)
  return groupEstablishments(establishments, t).length
}
