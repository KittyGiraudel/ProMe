import { suitIsRed } from '@/lib/suitGlyphs'
import { isFaceRank, type PlayingCard } from '@/lib/types'
import { establishmentLine } from '@/lib/village/data/establishments'
import type { VillageRoll } from '@/lib/village/generate'
import type { _Translator } from 'next-intl'

export type VillageTraitRow = {
  text: string
  /** One draw per face card; same `text` is merged into one row. */
  instances: readonly { card: PlayingCard; primarySlot: number }[]
}

export type VillageEstablishmentRow = {
  card: PlayingCard
  text: string
  /** Primary slot to reroll, or null when the card comes from a red Jack expansion. */
  rerollPrimarySlot: number | null
}

type TraitInstance = { card: PlayingCard; primarySlot: number }

/**
 * Compute the “color” (red/black) used by game text variants.
 *
 * Many village text variants depend on card color, not suit.
 */
function getCardColor(card: PlayingCard): 'red' | 'black' {
  return suitIsRed(card.suit) ? 'red' : 'black'
}

/**
 * Resolve village trait rows from the 5 primary cards.
 *
 * Rules:
 * - only face cards (J/Q/K) produce trait text rows
 * - identical trait *text* is merged into one row, but we keep all instances so
 *   the UI can show each originating card + reroll affordances per primary slot
 */
function resolveVillageTraits(
  primary: readonly PlayingCard[],
  t: _Translator,
): VillageTraitRow[] {
  const groups = new Map<string, TraitInstance[]>()

  for (let i = 0; i < primary.length; i++) {
    const card = primary[i]!
    if (!isFaceRank(card.rank)) continue
    const text = t(`game.village_traits.${card.rank}.${getCardColor(card)}`)
    const inst: TraitInstance = { card, primarySlot: i }
    const curr = groups.get(text)
    if (curr) curr.push(inst)
    else groups.set(text, [inst])
  }

  return [...groups.values()].map(instances => {
    const { card } = instances[0]!
    return {
      text: t(`game.village_traits.${card.rank}.${getCardColor(card)}`),
      instances,
    }
  })
}

/**
 * Resolve establishment rows in display order.
 *
 * Rules:
 * - numbered primary cards (A–10) add one establishment row tied to that primary slot
 * - a red Jack in primary consumes 3 expansion cards, each adding one establishment row
 *   (those rows have `rerollPrimarySlot: null` because rerolling is done on the Jack)
 *
 * The function returns how many expansion cards were consumed so the caller can assert
 * the roll’s expansion invariants.
 */
function resolveVillageEstablishments(
  roll: VillageRoll,
  t: _Translator,
): { establishments: VillageEstablishmentRow[]; expansionConsumed: number } {
  let expIdx = 0
  const establishments: VillageEstablishmentRow[] = []

  for (let i = 0; i < roll.primary.length; i++) {
    const card = roll.primary[i]!

    if (!isFaceRank(card.rank)) {
      establishments.push({
        card,
        text: establishmentLine(card, t),
        rerollPrimarySlot: i,
      })
      continue
    }

    // Red Jack => consumes 3 extra establishment cards (expansion).
    if (card.rank === 'J' && suitIsRed(card.suit)) {
      for (let k = 0; k < 3; k++) {
        const ec = roll.expansion[expIdx++]!
        establishments.push({
          card: ec,
          text: establishmentLine(ec, t),
          rerollPrimarySlot: null,
        })
      }
    }
  }

  return { establishments, expansionConsumed: expIdx }
}

/**
 * Assert that all expansion cards were consumed by red Jacks in the primary draw.
 *
 * If this fails, the `VillageRoll` is internally inconsistent (typically a bug or a
 * codec invariant mismatch) and we throw to surface it loudly in development/tests.
 */
function assertExpansionConsumed(
  consumed: number,
  expansionLength: number,
): void {
  if (consumed !== expansionLength) {
    throw new Error('resolveVillageDisplay: expansion length mismatch')
  }
}

/**
 * Resolve the village display model from a `VillageRoll`.
 *
 * Output:
 * - `traits`: merged face-card trait rows (with all originating instances)
 * - `establishments`: establishment rows in display order (including red-Jack expansion)
 *
 * This function is pure given `(roll, t)` and is safe to use in server or client
 * contexts (it depends only on deterministic mapping + the provided translator).
 *
 * Note: rulebook citations are intentionally NOT included here; those are a UI concern.
 */
export function resolveVillageDisplay(roll: VillageRoll, t: _Translator): {
  traits: VillageTraitRow[]
  establishments: VillageEstablishmentRow[]
} {
  const traits = resolveVillageTraits(roll.primary, t)
  const { establishments, expansionConsumed } = resolveVillageEstablishments(
    roll,
    t,
  )
  assertExpansionConsumed(expansionConsumed, roll.expansion.length)
  return { traits, establishments }
}

/**
 * For each establishment row in display order, the index into `owners[]`, or null when
 * the row is Ruines (no owner).
 */
export function ownerSlotIndexByEstablishmentIndex(
  establishments: readonly VillageEstablishmentRow[],
): (number | null)[] {
  let slot = 0
  return establishments.map(row => {
    // Ruines (rank 10) have no proprietor in the generator.
    if (row.card.rank === '10') return null
    const i = slot
    slot += 1
    return i
  })
}

