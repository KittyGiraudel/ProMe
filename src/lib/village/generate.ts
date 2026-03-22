import { randomCard, randomNumberedCard } from "../rng";
import type { PlayingCard } from "../types";
import { isFaceRank } from "../types";
import { suitIsRed } from "../suitGlyphs";
import { toVillagePrimaryTuple } from "./primaryTuple";

export type VillageRoll = {
  primary: readonly [
    PlayingCard,
    PlayingCard,
    PlayingCard,
    PlayingCard,
    PlayingCard,
  ];
  expansion: PlayingCard[];
};

export function countRedJacksInPrimary(
  primary: readonly PlayingCard[],
): number {
  return primary.filter((c) => c.rank === "J" && suitIsRed(c.suit)).length;
}

export function buildExpansionForPrimary(
  primary: readonly PlayingCard[],
  rng: () => number,
): PlayingCard[] {
  const n = countRedJacksInPrimary(primary);
  const out: PlayingCard[] = [];
  for (let i = 0; i < n * 3; i++) {
    out.push(randomNumberedCard(rng));
  }
  return out;
}

export function generateVillageRoll(
  rng: () => number = Math.random,
): VillageRoll {
  const primary = toVillagePrimaryTuple([
    randomCard(rng),
    randomCard(rng),
    randomCard(rng),
    randomCard(rng),
    randomCard(rng),
  ])!;
  const expansion = buildExpansionForPrimary(primary, rng);
  return { primary, expansion };
}

export function rerollVillagePrimarySlot(
  roll: VillageRoll,
  slotIndex: number,
  rng: () => number = Math.random,
): VillageRoll {
  if (slotIndex < 0 || slotIndex > 4) return roll;
  const next: PlayingCard[] = [...roll.primary];
  next[slotIndex] = randomCard(rng);
  const primary = toVillagePrimaryTuple(next)!;
  return { primary, expansion: buildExpansionForPrimary(primary, rng) };
}

/** Every expansion card must be numbered (A–10), not a face card. */
export function isValidExpansionCard(card: PlayingCard): boolean {
  return !isFaceRank(card.rank);
}
