import {
  decodePlayingCardString,
  encodePlayingCard,
} from "@/lib/codec/cards";
import { Faction, FACTIONS } from "@/lib/types";
import type { VillageRoll } from "./generate";
import { countRedJacksInPrimary, isValidExpansionCard } from "./generate";
import { toVillagePrimaryTuple } from "./primaryTuple";
import {
  decodeInhabitantRollParam,
  encodeInhabitantRoll,
} from '@/lib/inhabitant/inhabitantUrlCodec'
import type { InhabitantRoll } from '@/lib/inhabitant/generate'
import { _Translator } from "next-intl";

/**
 * Separator between compact inhabitant blobs inside the village owners payload.
 *
 * Hyphen does not appear in `encodeInhabitantRoll` output, so splitting is unambiguous.
 */
const BLOB_SEP = '-'

/**
 * Encode the list of village proprietors as a compact string.
 *
 * Format:
 * - join `encodeInhabitantRoll(owner)` blobs with `BLOB_SEP` (`-`)
 *
 * This output is used as part of the village route `[id]` (via `villageIdCodec`).
 */
export function encodeVillageOwners(owners: InhabitantRoll[]): string {
  return owners.map(encodeInhabitantRoll).join(BLOB_SEP);
}

/**
 * Decode the owners blob back into a list of `InhabitantRoll`s.
 *
 * Returns `null` if:
 * - the string is empty after trimming
 * - any blob fails `decodeInhabitantRollParam`
 *
 * Note: this function does **not** validate that the owner count matches a specific
 * village roll. That cross-field invariant is enforced by `decodeVillageIdParam`.
 */
export function decodeVillageOwnersParam(t: _Translator, raw: string): InhabitantRoll[] | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(BLOB_SEP).filter(Boolean);
  const out: InhabitantRoll[] = [];
  for (const p of parts) {
    const c = decodeInhabitantRollParam(p, t);
    if (!c) return null;
    out.push(c);
  }
  return out;
}

/**
 * Encode a `VillageRoll` into a compact cards-only payload.
 *
 * Format:
 * - 5 primary cards, then expansion cards, each encoded as 2 chars (`encodePlayingCard`)
 *
 * The expansion length is determined by the number of red Jacks in the primary draw:
 * - each red Jack consumes 3 extra numbered cards in `roll.expansion`
 */
export function encodeVillageRoll(roll: VillageRoll): string {
  let s = "";
  for (const c of roll.primary) {
    s += encodePlayingCard(c);
  }
  for (const c of roll.expansion) {
    s += encodePlayingCard(c);
  }
  return s;
}

/**
 * Decode a compact village roll payload.
 *
 * Validation rules:
 * - payload must decode to at least 5 cards
 * - first 5 cards must form a valid `VillageRoll.primary` tuple
 * - expansion length must be exactly `3 * countRedJacksInPrimary(primary)`
 * - expansion cards must be numbered (A–10), never face cards (J/Q/K)
 *
 * Returns `null` for invalid inputs.
 */
export function decodeVillageRollParam(raw: string): VillageRoll | null {
  const compact = raw.trim().toUpperCase();
  if (compact.length < 10 || compact.length % 2 !== 0) return null;
  const cards = decodePlayingCardString(compact);
  if (!cards || cards.length < 5) return null;

  const primary = toVillagePrimaryTuple(cards.slice(0, 5));
  if (!primary) return null;
  const expansion = cards.slice(5);
  const need = countRedJacksInPrimary(primary) * 3;
  if (expansion.length !== need) return null;
  for (const c of expansion) {
    if (!isValidExpansionCard(c)) return null;
  }
  return { primary, expansion };
}

/**
 * Decode the village faction query parameter (`?f=`).
 *
 * Returns `null` when absent or invalid; callers typically apply a default faction.
 */
export function decodeVillageFactionParam(raw: string | null): Faction | null {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();
  return (FACTIONS as readonly string[]).includes(s) ? (s as Faction) : null;
}
