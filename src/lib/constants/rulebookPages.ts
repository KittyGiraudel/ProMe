import type { Rank } from "../types";

/**
 * Rulebook page anchors for village establishment links (per-rank detail, table page).
 * Citations de bas de page générateur : `copy.rulebook.villageFootnote` / `characterFootnote` dans `fr.ts`.
 */
export const RULEBOOK_PAGES = {
  village: {
    chapter: 42,
    establishmentTable: 43,
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
