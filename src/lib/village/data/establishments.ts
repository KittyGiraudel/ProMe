import type { PlayingCard, Rank } from "../../types";
import { suitIsRed } from "../../suitGlyphs";
import { _Translator } from "next-intl";

/** Ranks 2–8: establishment type has three size tiers in the rulebook. */
const ESTABLISHMENT_SIZE_TIER_RANKS = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
] as const satisfies readonly Rank[];

export function rankUsesEstablishmentSizeTiers(rank: Rank): boolean {
  return (ESTABLISHMENT_SIZE_TIER_RANKS as readonly Rank[]).includes(rank);
}

/** Game tier 1–3 (ascending size); indexes `establishmentSizeTierLines` copy at `tier - 1`. */
export type EstablishmentSizeTier = 1 | 2 | 3;

export function establishmentLineFromSizeTier(
  rank: Rank,
  tier: EstablishmentSizeTier,
  t: _Translator
): string {
  if (!rankUsesEstablishmentSizeTiers(rank)) {
    throw new Error(`establishmentLineFromSizeTier: rank ${rank}`);
  }

  return t(
    `game.establishments.${rank}.${tier - 1}`,
  );
}

/** Label for an establishment card (A–10 only). */
export function establishmentLine(card: PlayingCard, t: _Translator): string {
  const { suit, rank } = card;
  if (rank === "J" || rank === "Q" || rank === "K") {
    throw new Error("establishmentLine: face card");
  }
  if (rankUsesEstablishmentSizeTiers(rank)) {
    return establishmentLineFromSizeTier(rank, suitIsRed(suit) ? 2 : 1, t);
  }
  return lineForRankOther(rank, suitIsRed(suit), t);
}

function lineForRankOther(rank: Rank, red: boolean, t: _Translator): string {
  switch (rank) {
    case "A":
      return red ? t('game.establishments.A.red') : t('game.establishments.A.black');
    case "9":
      return red ? t('game.establishments.9.red') : t('game.establishments.9.black');
    case "10":
      return t('game.establishments.10')
    default:
      throw new Error(`establishmentLine: unexpected rank ${rank}`);
  }
}
