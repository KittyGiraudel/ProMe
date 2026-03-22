import type { PlayingCard } from "../types";
import type { VillageRoll } from "./generate";

/**
 * Narrows five cards to `VillageRoll["primary"]` after a length check (TypeScript
 * cannot prove array length from slice/spread alone).
 */
export function toVillagePrimaryTuple(
  cards: readonly PlayingCard[],
): VillageRoll["primary"] | null {
  if (cards.length !== 5) return null;
  return cards as VillageRoll["primary"];
}
