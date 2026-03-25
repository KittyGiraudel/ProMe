import { useCallback } from "react";
import { _Translator, useTranslations } from "next-intl";
import { establishmentDetailRulebookPage, RULEBOOK_PAGES } from "@/lib/constants/rulebookPages";
import { generateInhabitantWithFaction, InhabitantRoll } from "@/lib/inhabitant/generate";
import { suitIsRed } from "@/lib/suitGlyphs";
import { Faction, isFaceRank, PlayingCard } from "@/lib/types";
import { establishmentLine } from "@/lib/village/data/establishments";
import { VillageRoll } from "@/lib/village/generate";

function generateOwnersForVillage(
  roll: VillageRoll,
  faction: Faction,
  t: _Translator,
  rng: () => number = Math.random,
): InhabitantRoll[] {
  const n = resolveVillageDisplay(roll, t).establishments.filter(
    establishmentRowHasOwner,
  ).length;
  const out: InhabitantRoll[] = [];
  for (let i = 0; i < n; i++) {
    out.push(generateInhabitantWithFaction(faction, t, rng));
  }
  return out;
}

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

export function resolveVillageDisplay(roll: VillageRoll, t: _Translator): {
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
      const color = suitIsRed(card.suit) ? 'red' : 'black'
      const text = t(`game.village_traits.${card.rank}.${color}`);
      const inst = { card, primarySlot: i };
      const cur = traitGroups.get(text);
      if (cur) cur.push(inst);
      else traitGroups.set(text, [inst]);
    }
  }
  const traits: VillageTraitRow[] = [...traitGroups.values()].map(
    (instances) => {
      const {card} = instances[0]!
      const color = suitIsRed(card.suit) ? 'red' : 'black'
      return {
        text: t(`game.village_traits.${card.rank}.${color}`),
        instances,
        rulebookPage: RULEBOOK_PAGES.village.establishmentTable,
      }
    },
  );

  let expIdx = 0;
  const establishments: VillageEstablishmentRow[] = [];

  for (let i = 0; i < roll.primary.length; i++) {
    const card = roll.primary[i]!;
    if (!isFaceRank(card.rank)) {
      establishments.push({
        card,
        text: establishmentLine(card, t),
        rerollPrimarySlot: i,
        rulebookPage: establishmentDetailRulebookPage(card.rank),
      });
    } else if (card.rank === "J" && suitIsRed(card.suit)) {
      for (let k = 0; k < 3; k++) {
        const ec = roll.expansion[expIdx++]!;
        establishments.push({
          card: ec,
          text: establishmentLine(ec, t),
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
function establishmentRowHasOwner(row: VillageEstablishmentRow): boolean {
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

/** How many proprietor rolls the village URL holds (all numbered establishments except Ruines). */
function countVillageOwnerSlots(roll: VillageRoll, t: _Translator): number {
  return resolveVillageDisplay(roll, t).establishments.filter(
    establishmentRowHasOwner,
  ).length;
}

export const useVillageGenerator = () => {
  const t = useTranslations();
  const _countVillageOwnerSlots = useCallback((roll: VillageRoll) => countVillageOwnerSlots(roll, t), [t])
  const _resolveVillageDisplay = useCallback((roll: VillageRoll) => resolveVillageDisplay(roll, t), [t])
  const _generateOwnersForVillage = useCallback((roll: VillageRoll, faction: Faction) => generateOwnersForVillage(roll, faction, t), [t])

  return {
    countVillageOwnerSlots: _countVillageOwnerSlots,
    resolveVillageDisplay: _resolveVillageDisplay,
    ownerSlotIndexByEstablishmentIndex,
    generateOwnersForVillage: _generateOwnersForVillage
  }
}