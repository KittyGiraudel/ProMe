import type { PlayingCard } from "../types";
import { isFaceRank } from "../types";
import { suitIsRed } from "../suitGlyphs";
import {
  establishmentDetailRulebookPage,
  VILLAGE_RULEBOOK_PAGES_FR,
} from "./data/establishmentPages";
import { establishmentLineFr } from "./data/establishments";
import { villageTraitTextFr } from "./data/traits";
import type { VillageRoll } from "./generate";

export type VillageTraitRow = {
  card: PlayingCard;
  text: string;
  /** Index in the 5-card primary draw (for reroll). */
  primarySlot: number;
  /** Rulebook page for the « Établissement » table (figures + types). */
  rulebookPage: number;
};

export type VillageEstablishmentRow = {
  card: PlayingCard;
  text: string;
  /** Primary slot to reroll, or null when the card comes from a red Jack expansion. */
  rerollPrimarySlot: number | null;
  /** Page where this establishment type is detailed (see `establishmentPages.ts`). */
  rulebookPage: number;
};

export function resolveVillageDisplay(roll: VillageRoll): {
  traits: VillageTraitRow[];
  establishments: VillageEstablishmentRow[];
} {
  const traits: VillageTraitRow[] = [];
  for (let i = 0; i < roll.primary.length; i++) {
    const card = roll.primary[i]!;
    if (isFaceRank(card.rank)) {
      traits.push({
        card,
        text: villageTraitTextFr(card),
        primarySlot: i,
        rulebookPage: VILLAGE_RULEBOOK_PAGES_FR.establishmentTable,
      });
    }
  }

  let expIdx = 0;
  const establishments: VillageEstablishmentRow[] = [];

  for (let i = 0; i < roll.primary.length; i++) {
    const card = roll.primary[i]!;
    if (!isFaceRank(card.rank)) {
      establishments.push({
        card,
        text: establishmentLineFr(card),
        rerollPrimarySlot: i,
        rulebookPage: establishmentDetailRulebookPage(card.rank),
      });
    } else if (card.rank === "J" && suitIsRed(card.suit)) {
      for (let k = 0; k < 3; k++) {
        const ec = roll.expansion[expIdx++]!;
        establishments.push({
          card: ec,
          text: establishmentLineFr(ec),
          rerollPrimarySlot: null,
          rulebookPage: establishmentDetailRulebookPage(ec.rank),
        });
      }
    }
  }

  if (expIdx !== roll.expansion.length) {
    throw new Error("resolveVillageDisplay: expansion length mismatch");
  }

  return { traits, establishments };
}
