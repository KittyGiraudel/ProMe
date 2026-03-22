import type { PlayingCard } from "../types";
import { isFaceRank } from "../types";
import { suitIsRed } from "../suitGlyphs";
import {
  establishmentDetailRulebookPage,
  RULEBOOK_PAGES,
} from "../constants/rulebookPages";
import { establishmentLine } from "./data/establishments";
import { villageTraitText } from "./data/traits";
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
  /** Page where this establishment type is detailed (see `rulebookPages.ts`). */
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
      const text = villageTraitText(card);
      const inst = { card, primarySlot: i };
      const cur = traitGroups.get(text);
      if (cur) cur.push(inst);
      else traitGroups.set(text, [inst]);
    }
  }
  const traits: VillageTraitRow[] = [...traitGroups.values()].map(
    (instances) => ({
      text: villageTraitText(instances[0]!.card),
      instances,
      rulebookPage: RULEBOOK_PAGES.village.establishmentTable,
    }),
  );

  let expIdx = 0;
  const establishments: VillageEstablishmentRow[] = [];

  for (let i = 0; i < roll.primary.length; i++) {
    const card = roll.primary[i]!;
    if (!isFaceRank(card.rank)) {
      establishments.push({
        card,
        text: establishmentLine(card),
        rerollPrimarySlot: i,
        rulebookPage: establishmentDetailRulebookPage(card.rank),
      });
    } else if (card.rank === "J" && suitIsRed(card.suit)) {
      for (let k = 0; k < 3; k++) {
        const ec = roll.expansion[expIdx++]!;
        establishments.push({
          card: ec,
          text: establishmentLine(ec),
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

/** Ruines (rank 10) have no proprietor in the generator. */
export function establishmentRowHasOwner(row: VillageEstablishmentRow): boolean {
  return row.card.rank !== "10";
}

/**
 * For each establishment row in display order, the index into `owners[]`, or null when
 * the row is Ruines (no owner).
 */
export function ownerSlotIndexByEstablishmentIndex(
  establishments: readonly VillageEstablishmentRow[],
): (number | null)[] {
  let slot = 0;
  return establishments.map((row) => {
    if (!establishmentRowHasOwner(row)) return null;
    const i = slot;
    slot += 1;
    return i;
  });
}

/** Number of establishment rows in resolution order. */
export function countVillageEstablishments(roll: VillageRoll): number {
  return resolveVillageDisplay(roll).establishments.length;
}

/** How many proprietor rolls the village URL holds (all numbered establishments except Ruines). */
export function countVillageOwnerSlots(roll: VillageRoll): number {
  return resolveVillageDisplay(roll).establishments.filter(
    establishmentRowHasOwner,
  ).length;
}
