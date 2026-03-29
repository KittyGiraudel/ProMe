import {
  generateInhabitantWithFaction,
  type InhabitantRoll,
} from '@/lib/inhabitant/generate'
import type { Faction } from '@/lib/types'
import { resolveVillageDisplay } from '@/lib/village/resolveVillageDisplay'
import type { VillageRoll } from '@/lib/village/generate'
import type { _Translator } from 'next-intl'

/**
 * Compute how many inhabitant owners must exist for a given `VillageRoll`.
 *
 * The UI renders one owner per *establishment row* (after resolution), except for
 * Ruines (rank `"10"`), which intentionally have **no** proprietor.
 *
 * This is the authoritative count used by:
 * - URL decoding/validation (owners segment length must match)
 * - owner generation (create exactly this many `InhabitantRoll`s)
 */
export function countVillageOwnerSlots(
  roll: VillageRoll,
  t: _Translator
): number {
  return resolveVillageDisplay(roll, t).establishments.filter(
    row => row.card.rank !== '10'
  ).length
}

/**
 * Generate the list of proprietor rolls for a village.
 *
 * Owners are generated in the same order as establishment rows are resolved, so
 * `ownerSlotIndexByEstablishmentIndex(...)` can map establishment rows to owners.
 *
 * Note: this uses `generateInhabitantWithFaction(...)` so all owners share the chosen
 * village faction.
 */
export function generateOwnersForVillage(
  roll: VillageRoll,
  faction: Faction,
  t: _Translator,
  rng: () => number = Math.random
): InhabitantRoll[] {
  const n = countVillageOwnerSlots(roll, t)
  const out: InhabitantRoll[] = []
  for (let i = 0; i < n; i++) {
    out.push(generateInhabitantWithFaction(faction, t, rng))
  }
  return out
}
