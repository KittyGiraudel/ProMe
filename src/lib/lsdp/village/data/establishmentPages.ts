import type { Rank } from "../../types";

/**
 * Rulebook chapter anchors (générateur / table des cartes).
 * Ajustez si besoin selon votre impression.
 */
export const VILLAGE_RULEBOOK_PAGES = {
  /** « Établissement » — table As–10 + figures (carte → type / trait). */
  establishmentTable: 43,
  /** « Les villages » — tirage des 5 cartes, encadré doublons, etc. */
  villageChapter: 42,
} as const;

type EstablishmentRank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

/**
 * Page du livre où est détaillé chaque type d’établissement (règle LSDP).
 */
export const ESTABLISHMENT_DETAIL_PAGE_BY_RANK: Record<
  EstablishmentRank,
  number
> = {
  A: 44,
  "2": 45,
  "3": 46,
  "4": 47,
  "5": 48,
  "6": 49,
  "7": 50,
  "8": 51,
  "9": 54,
  "10": 63,
};

export function establishmentDetailRulebookPage(rank: Rank): number {
  if (rank === "J" || rank === "Q" || rank === "K") {
    return VILLAGE_RULEBOOK_PAGES.establishmentTable;
  }
  return ESTABLISHMENT_DETAIL_PAGE_BY_RANK[rank];
}
