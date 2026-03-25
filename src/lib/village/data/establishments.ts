import type { PlayingCard, Rank } from "../../types";
import { suitIsRed } from "../../suitGlyphs";
import { Localize } from "@/lib/localization/localize";

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

export function establishmentLineFromSizeTier(
  rank: Rank,
  tier: EstablishmentSizeTier,
  localize: Localize
): string {
  if (!rankUsesEstablishmentSizeTiers(rank)) {
    throw new Error(`establishmentLineFromSizeTier: rank ${rank}`);
  }

  const resolved = localize.resolve(
    `game.villageEstablishments.establishmentSizeTierLines.${rank}`,
  );
  if (!Array.isArray(resolved) || !resolved.every((v) => typeof v === 'string')) {
    throw new Error(
      `establishmentLineFromSizeTier: copy key "game.villageEstablishments.establishmentSizeTierLines.${rank}" did not resolve to string[]`,
    );
  }

  return resolved[tier - 1]!;
}

/** Label for an establishment card (A–10 only). */
export function establishmentLine(card: PlayingCard, localize: Localize): string {
  const { suit, rank } = card;
  if (rank === "J" || rank === "Q" || rank === "K") {
    throw new Error("establishmentLine: face card");
  }
  if (rankUsesEstablishmentSizeTiers(rank)) {
    return establishmentLineFromSizeTier(rank, suitIsRed(suit) ? 2 : 1, localize);
  }
  return lineForRankOther(rank, suitIsRed(suit), localize);
}

function lineForRankOther(rank: Rank, red: boolean, localize: Localize): string {
  switch (rank) {
    case "A":
      return red ? localize.string('game.villageEstablishments.rankA.red') : localize.string('game.villageEstablishments.rankA.black');
    case "9":
      return red ? localize.string('game.villageEstablishments.rank9.red') : localize.string('game.villageEstablishments.rank9.black');
    case "10":
      return localize.string('game.villageEstablishments.rank10')
    default:
      throw new Error(`establishmentLine: unexpected rank ${rank}`);
  }
}
