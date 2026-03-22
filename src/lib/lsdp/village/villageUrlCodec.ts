/**
 * Village URL: `v=<10 + 6×redJacks>` chars — five primary cards, then three
 * numbered cards per **red Jack** in primary order.
 *
 * Phase 2 (owners): could add `&o=` with a delimiter not used by
 * `encodeCharacterRoll` (e.g. `~` or `.`) between `encodeCharacterRoll` blobs,
 * one per establishment row in display order.
 */

import {
  decodePlayingCardString,
  encodePlayingCard,
} from "../playingCardCodec";
import type { VillageRoll } from "./generate";
import { countRedJacksInPrimary, isValidExpansionCard } from "./generate";

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

export function decodeVillageRollParam(raw: string): VillageRoll | null {
  const compact = raw.trim().toUpperCase();
  if (compact.length < 10 || compact.length % 2 !== 0) return null;
  const cards = decodePlayingCardString(compact);
  if (!cards || cards.length < 5) return null;

  const primary = cards.slice(0, 5) as unknown as VillageRoll["primary"];
  const expansion = cards.slice(5);
  const need = countRedJacksInPrimary(primary) * 3;
  if (expansion.length !== need) return null;
  for (const c of expansion) {
    if (!isValidExpansionCard(c)) return null;
  }
  return { primary, expansion };
}
