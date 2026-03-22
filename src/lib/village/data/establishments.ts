import { copy } from "@/messages/fr";
import type { PlayingCard, Rank } from "../../types";
import { suitIsRed } from "../../suitGlyphs";

const PETITE_GRANDE_RANKS = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
] as const satisfies readonly Rank[];

export function rankUsesPetiteGrandeEstablishment(rank: Rank): boolean {
  return (PETITE_GRANDE_RANKS as readonly Rank[]).includes(rank);
}

/** Game tier 1–3 (ascending size); indexes `petiteGrande` copy lines at `tier - 1`. */
export type EstablishmentSizeTier = 1 | 2 | 3;

type PetiteGrandeRank = (typeof PETITE_GRANDE_RANKS)[number];

export function establishmentLineFromSizeTier(
  rank: Rank,
  tier: EstablishmentSizeTier,
): string {
  if (!rankUsesPetiteGrandeEstablishment(rank)) {
    throw new Error(`establishmentLineFromSizeTier: rank ${rank}`);
  }
  const lines =
    copy.game.villageEstablishments.petiteGrande[rank as PetiteGrandeRank];
  return lines[tier - 1];
}

/** Label for an establishment card (A–10 only). */
export function establishmentLine(card: PlayingCard): string {
  const { suit, rank } = card;
  if (rank === "J" || rank === "Q" || rank === "K") {
    throw new Error("establishmentLine: face card");
  }
  if (rankUsesPetiteGrandeEstablishment(rank)) {
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
