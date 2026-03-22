import type { Rank } from "../types";

/**
 * Rulebook page anchors for this printing — single place to retune citations.
 * Ajustez si besoin selon votre impression.
 */
export const RULEBOOK_PAGES = {
  character: {
    /** Section « Habitants » — D6, cartes âge/personnalité & contexte, etc. */
    inhabitantChapter: "56–58",
    /** Table des noms (1D66 / 2D6), citée p. ex. pour le contexte 10. */
    nameTable: "60",
  },
  village: {
    /** « Les villages » — tirage des 5 cartes, encadré doublons, etc. */
    chapter: 42,
    /** « Établissement » — table As–10 + figures (carte → type / trait). */
    establishmentTable: 43,
    /** Page du livre pour le détail de chaque type d’établissement (As–10). J/Q/K → `establishmentTable`. */
    establishmentDetailByRank: {
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
    },
  },
} as const;

export function establishmentDetailRulebookPage(rank: Rank): number {
  if (rank === "J" || rank === "Q" || rank === "K") {
    return RULEBOOK_PAGES.village.establishmentTable;
  }
  return RULEBOOK_PAGES.village.establishmentDetailByRank[rank];
}
