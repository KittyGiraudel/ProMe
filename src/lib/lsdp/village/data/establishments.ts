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

/** 1 = petite/petit, 2 = grande/grand, 3 = immense (merged). */
export type EstablishmentSizeTier = 1 | 2 | 3;

export function establishmentLineFrFromSizeTier(
  rank: Rank,
  tier: EstablishmentSizeTier,
): string {
  if (!rankUsesPetiteGrandeEstablishment(rank)) {
    throw new Error(`establishmentLineFrFromSizeTier: rank ${rank}`);
  }
  switch (rank) {
    case "2":
      if (tier === 3) return "Immense boutique de potions";
      if (tier === 2) return "Grande boutique de potions";
      return "Petite boutique de potions";
    case "3":
      if (tier === 3) return "Immense boutique d’équipement";
      if (tier === 2) return "Grande boutique d’équipement";
      return "Petite boutique d’équipement";
    case "4":
      if (tier === 3) return "Immense boutique de vêtements";
      if (tier === 2) return "Grande boutique de vêtements";
      return "Petite boutique de vêtements";
    case "5":
      if (tier === 3) return "Immense taverne";
      if (tier === 2) return "Grande taverne";
      return "Petite taverne";
    case "6":
      if (tier === 3) return "Immense bureau de cartographie";
      if (tier === 2) return "Grand bureau de cartographie";
      return "Petit bureau de cartographie";
    case "7":
      if (tier === 3) return "Immense auberge";
      if (tier === 2) return "Grande auberge";
      return "Petite auberge";
    case "8":
      if (tier === 3) return "Immense agence de missions";
      if (tier === 2) return "Grande agence de missions";
      return "Petite agence de missions";
    default:
      throw new Error(`establishmentLineFrFromSizeTier: unexpected rank ${rank}`);
  }
}

/** French label for an establishment card (A–10 only). */
export function establishmentLineFr(card: PlayingCard): string {
  const { suit, rank } = card;
  if (rank === "J" || rank === "Q" || rank === "K") {
    throw new Error("establishmentLineFr: face card");
  }
  if (rankUsesPetiteGrandeEstablishment(rank)) {
    return establishmentLineFrFromSizeTier(rank, suitIsRed(suit) ? 2 : 1);
  }
  return lineForRankOther(rank, suitIsRed(suit));
}

function lineForRankOther(rank: Rank, red: boolean): string {
  switch (rank) {
    case "A":
      return red ? "Oratoire permanent" : "Oratoire éphémère";
    case "9":
      return red ? "Gare en activité" : "Gare à l'abandon";
    case "10":
      return "Ruines";
    default:
      throw new Error(`establishmentLineFr: unexpected rank ${rank}`);
  }
}
