import { lookupName } from "./data/namesByRace";
import { genderFromD6, raceFromD6 } from "./maps";
import type { CharacterRoll } from "./generate";
import type { PlayingCard } from "../types";
import { contextByRank } from "@/messages/fr";
import {
  decodePlayingCardPair as decodeCard,
  encodePlayingCard as encodeCard,
} from "../codec/cards";

function parseRaceDie(c: string): number | null {
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

function dualFromLegacyMerged(merged: PlayingCard): {
  ageCard: PlayingCard;
  personalityCard: PlayingCard;
} {
  return { ageCard: merged, personalityCard: merged };
}

/** Pre–split URL: 1D6 race, 1 card (age+personality), context, 2D6 name, 1D6 gender — 8 chars. */
function decodeCharacterRollBaseLegacy(compact: string): CharacterRoll | null {
  if (compact.length !== 8) return null;

  const raceDie = parseRaceDie(compact[0]!);
  const merged = decodeCard(compact.slice(1, 3));
  const contextCard = decodeCard(compact.slice(3, 5));
  const n1 = parseNameDie(compact[5]!);
  const n2 = parseNameDie(compact[6]!);
  const genderDie = parseRaceDie(compact[7]!);

  if (
    raceDie === null ||
    merged === null ||
    contextCard === null ||
    n1 === null ||
    n2 === null ||
    genderDie === null
  ) {
    return null;
  }

  const { ageCard, personalityCard } = dualFromLegacyMerged(merged);
  const race = raceFromD6(raceDie);
  const nameDice: [number, number] = [n1, n2];
  const name = lookupName(race, n1, n2);
  const contextText = contextByRank[contextCard.rank];
  const gender = genderFromD6(genderDie);

  return {
    raceDie,
    race,
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

/** Current URL: race, age card, personality card, context, 2D6 name, 1D6 gender — 10 chars. */
function decodeCharacterRollBaseV2(compact: string): CharacterRoll | null {
  if (compact.length !== 10) return null;

  const raceDie = parseRaceDie(compact[0]!);
  const ageCard = decodeCard(compact.slice(1, 3));
  const personalityCard = decodeCard(compact.slice(3, 5));
  const contextCard = decodeCard(compact.slice(5, 7));
  const n1 = parseNameDie(compact[7]!);
  const n2 = parseNameDie(compact[8]!);
  const genderDie = parseRaceDie(compact[9]!);

  if (
    raceDie === null ||
    ageCard === null ||
    personalityCard === null ||
    contextCard === null ||
    n1 === null ||
    n2 === null ||
    genderDie === null
  ) {
    return null;
  }

  const race = raceFromD6(raceDie);
  const nameDice: [number, number] = [n1, n2];
  const name = lookupName(race, n1, n2);
  const contextText = contextByRank[contextCard.rank];
  const gender = genderFromD6(genderDie);

  return {
    raceDie,
    race,
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
 * Compact query: 1D6 race, 2× age/personality cards, context, 2D6 name, 1D6 gender — 10 chars.
 * Optional tail: +1 D6 if context rank 7, +2 D6 if context rank 10.
 * Legacy 8/9/10-char payloads (single merged age/personality card) still decode.
 */
export function encodeCharacterRoll(roll: CharacterRoll): string {
  let s = `${roll.raceDie}${encodeCard(roll.ageCard)}${encodeCard(roll.personalityCard)}${encodeCard(roll.contextCard)}${roll.nameDice[0]}${roll.nameDice[1]}${roll.genderDie}`;
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

function tryDecodeLegacyLength10(compact: string): CharacterRoll | null {
  if (compact.length !== 10) return null;
  const base = decodeCharacterRollBaseLegacy(compact.slice(0, 8));
  if (!base || base.contextCard.rank !== "10") return null;
  const a = parseNameDie(compact[8]!);
  const b = parseNameDie(compact[9]!);
  if (a === null || b === null) return null;
  const contextSpokenNameDice: [number, number] = [a, b];
  const contextSpokenName = lookupName(base.race, a, b);
  return { ...base, contextSpokenNameDice, contextSpokenName };
}

export function decodeCharacterRollParam(raw: string): CharacterRoll | null {
  const compact = raw.trim().toUpperCase();
  const len = compact.length;

  if (len === 8) {
    return decodeCharacterRollBaseLegacy(compact);
  }

  if (len === 9) {
    const base = decodeCharacterRollBaseLegacy(compact.slice(0, 8));
    if (!base) return null;
    if (base.contextCard.rank !== "7") return null;
    const contextSevenDie = parseRaceDie(compact[8]!);
    if (contextSevenDie === null) return null;
    return { ...base, contextSevenDie };
  }

  if (len === 10) {
    const legacyRank10 = tryDecodeLegacyLength10(compact);
    if (legacyRank10) return legacyRank10;
    return decodeCharacterRollBaseV2(compact);
  }

  if (len === 11) {
    const base = decodeCharacterRollBaseV2(compact.slice(0, 10));
    if (!base) return null;
    if (base.contextCard.rank !== "7") return null;
    const contextSevenDie = parseRaceDie(compact[10]!);
    if (contextSevenDie === null) return null;
    return { ...base, contextSevenDie };
  }

  if (len === 12) {
    const base = decodeCharacterRollBaseV2(compact.slice(0, 10));
    if (!base) return null;
    if (base.contextCard.rank !== "10") return null;
    const a = parseNameDie(compact[10]!);
    const b = parseNameDie(compact[11]!);
    if (a === null || b === null) return null;
    const contextSpokenNameDice: [number, number] = [a, b];
    const contextSpokenName = lookupName(base.race, a, b);
    return { ...base, contextSpokenNameDice, contextSpokenName };
  }

  return null;
}
