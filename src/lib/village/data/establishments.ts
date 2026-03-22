import { copy } from "@/messages/fr";
import type { PlayingCard, Rank } from "../../types";
import { suitIsRed } from "../../suitGlyphs";

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

type EstablishmentSizeTierRank = (typeof ESTABLISHMENT_SIZE_TIER_RANKS)[number];

export function establishmentLineFromSizeTier(
  rank: Rank,
  tier: EstablishmentSizeTier,
): string {
  if (!rankUsesEstablishmentSizeTiers(rank)) {
    throw new Error(`establishmentLineFromSizeTier: rank ${rank}`);
  }
  const lines =
    copy.game.villageEstablishments.establishmentSizeTierLines[
      rank as EstablishmentSizeTierRank
    ];
  return lines[tier - 1];
}

/** Label for an establishment card (A–10 only). */
export function establishmentLine(card: PlayingCard): string {
  const { suit, rank } = card;
  if (rank === "J" || rank === "Q" || rank === "K") {
    throw new Error("establishmentLine: face card");
  }
  if (rankUsesEstablishmentSizeTiers(rank)) {
    return establishmentLineFromSizeTier(rank, suitIsRed(suit) ? 2 : 1);
  }
  return lineForRankOther(rank, suitIsRed(suit));
}

function lineForRankOther(rank: Rank, red: boolean): string {
  const est = copy.game.villageEstablishments;
  switch (rank) {
    case "A":
      return red ? est.rankA.red : est.rankA.black;
    case "9":
      return red ? est.rank9.red : est.rank9.black;
    case "10":
      return est.rank10;
    default:
      throw new Error(`establishmentLine: unexpected rank ${rank}`);
  }
}
