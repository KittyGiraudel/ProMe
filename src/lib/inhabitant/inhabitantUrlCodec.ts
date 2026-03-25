import { lookupName } from "./data/namesByFaction";
import { genderFromD6, factionFromD6 } from "./maps";
import type { InhabitantRoll } from "./generate";
import {
  decodePlayingCardPair as decodeCard,
  encodePlayingCard as encodeCard,
} from "../codec/cards";
import { Localize } from "../localization/localize";

function parseFactionDie(c: string): number | null {
  if (c.length !== 1) return null;
  const n = Number(c);
  if (!Number.isInteger(n) || n < 1 || n > 6) return null;
  return n;
}

function parseNameDie(c: string): number | null {
  if (c.length !== 1) return null;
  const n = Number(c);
  if (!Number.isInteger(n) || n < 1 || n > 6) return null;
  return n;
}

/** Current URL: faction, age card, personality card, context, 2D6 name, 1D6 gender — 10 chars. */
function decodeInhabitantRollBaseV2(compact: string, localize: Localize): InhabitantRoll | null {
  if (compact.length !== 10) return null;

  const factionDie = parseFactionDie(compact[0]!);
  const ageCard = decodeCard(compact.slice(1, 3));
  const personalityCard = decodeCard(compact.slice(3, 5));
  const contextCard = decodeCard(compact.slice(5, 7));
  const n1 = parseNameDie(compact[7]!);
  const n2 = parseNameDie(compact[8]!);
  const genderDie = parseFactionDie(compact[9]!);

  if (
    factionDie === null ||
    ageCard === null ||
    personalityCard === null ||
    contextCard === null ||
    n1 === null ||
    n2 === null ||
    genderDie === null
  ) {
    return null;
  }

  const faction = factionFromD6(factionDie);
  const nameDice: [number, number] = [n1, n2];
  const name = lookupName(faction, n1, n2);
  const contextText = localize.string(`game.inhabitantContextByRank.${contextCard.rank}`);
  const gender = genderFromD6(genderDie);

  return {
    factionDie,
    faction,
    ageCard,
    personalityCard,
    contextCard,
    nameDice,
    name,
    contextText,
    genderDie,
    gender,
  };
}

/**
 * Compact query: 1D6 faction, 2× age/personality cards, context, 2D6 name, 1D6 gender — 10 chars.
 * Optional tail: +1 D6 if context rank 7, +2 D6 if context rank 10.
 * Legacy 8/9/10-char payloads (single merged age/personality card) still decode.
 */
export function encodeInhabitantRoll(roll: InhabitantRoll): string {
  let s = `${roll.factionDie}${encodeCard(roll.ageCard)}${encodeCard(roll.personalityCard)}${encodeCard(roll.contextCard)}${roll.nameDice[0]}${roll.nameDice[1]}${roll.genderDie}`;
  if (roll.contextCard.rank === "7" && roll.contextSevenDie != null) {
    s += String(roll.contextSevenDie);
  } else if (
    roll.contextCard.rank === "10" &&
    roll.contextSpokenNameDice != null
  ) {
    s += String(roll.contextSpokenNameDice[0]);
    s += String(roll.contextSpokenNameDice[1]);
  }
  return s;
}

export function decodeInhabitantRollParam(raw: string, localize: Localize): InhabitantRoll | null {
  const compact = raw.trim().toUpperCase();
  const len = compact.length;

  if (len === 11) {
    const base = decodeInhabitantRollBaseV2(compact.slice(0, 10), localize);
    if (!base) return null;
    if (base.contextCard.rank !== "7") return null;
    const contextSevenDie = parseFactionDie(compact[10]!);
    if (contextSevenDie === null) return null;
    return { ...base, contextSevenDie };
  }

  if (len === 12) {
    const base = decodeInhabitantRollBaseV2(compact.slice(0, 10), localize);
    if (!base) return null;
    if (base.contextCard.rank !== "10") return null;
    const a = parseNameDie(compact[10]!);
    const b = parseNameDie(compact[11]!);
    if (a === null || b === null) return null;
    const contextSpokenNameDice: [number, number] = [a, b];
    const contextSpokenName = lookupName(base.faction, a, b);
    return { ...base, contextSpokenNameDice, contextSpokenName };
  }

  return null;
}
