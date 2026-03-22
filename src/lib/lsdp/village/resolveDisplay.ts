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
  text: string;
  /** One draw per face card; same `text` is merged into one row. */
  instances: readonly { card: PlayingCard; primarySlot: number }[];
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
  const traitGroups = new Map<
    string,
    { card: PlayingCard; primarySlot: number }[]
  >();
  for (let i = 0; i < roll.primary.length; i++) {
    const card = roll.primary[i]!;
    if (isFaceRank(card.rank)) {
      const text = villageTraitTextFr(card);
      const inst = { card, primarySlot: i };
      const cur = traitGroups.get(text);
      if (cur) cur.push(inst);
      else traitGroups.set(text, [inst]);
    }
  }
  const traits: VillageTraitRow[] = [...traitGroups.values()].map(
    (instances) => ({
      text: villageTraitTextFr(instances[0]!.card),
      instances,
      rulebookPage: VILLAGE_RULEBOOK_PAGES_FR.establishmentTable,
    }),
  );

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

/** Number of establishment rows in resolution order (one owner each; merges share co-owners). */
export function countVillageEstablishments(roll: VillageRoll): number {
  return resolveVillageDisplay(roll).establishments.length;
}
