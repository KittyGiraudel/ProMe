import { lookupName } from "./data/namesByRace";
import { genderFromD6, raceFromD6 } from "./maps";
import type { CharacterRoll } from "./generate";
import { contextByRank } from "./data/contextByRank";
import {
  decodePlayingCardPair as decodeCard,
  encodePlayingCard as encodeCard,
} from "../playingCardCodec";
import { RANKS, type PlayingCard, type Suit } from "../types";

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

function legacyGenderDie(
  raceDie: number,
  ageCard: PlayingCard,
  contextCard: PlayingCard,
  n1: number,
  n2: number,
): number {
  const suitN = (s: Suit) =>
    ({ hearts: 0, diamonds: 1, clubs: 2, spades: 3 })[s];
  const sum =
    raceDie * 17 +
    n1 * 19 +
    n2 * 23 +
    suitN(ageCard.suit) * 3 +
    RANKS.indexOf(ageCard.rank) * 5 +
    suitN(contextCard.suit) * 7 +
    RANKS.indexOf(contextCard.rank) * 11;
  return (sum % 6) + 1;
}

/** Compact query: 1D6 race, 2× card, 2D6 name, 1D6 gender — 8 chars. Legacy 7-char URLs omit gender (derived deterministically). Optional tail: +1 D6 if context rank 7, +2 D6 if context rank 10. */
export function encodeCharacterRoll(roll: CharacterRoll): string {
  let s = `${roll.raceDie}${encodeCard(roll.agePersonalityCard)}${encodeCard(roll.contextCard)}${roll.nameDice[0]}${roll.nameDice[1]}${roll.genderDie}`;
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

function decodeCharacterRollBase(compact: string): CharacterRoll | null {
  if (compact.length !== 7 && compact.length !== 8) return null;

  const raceDie = parseRaceDie(compact[0]!);
  const ageCard = decodeCard(compact.slice(1, 3));
  const contextCard = decodeCard(compact.slice(3, 5));
  const n1 = parseNameDie(compact[5]!);
  const n2 = parseNameDie(compact[6]!);
  const genderDieParsed =
    compact.length === 8 ? parseRaceDie(compact[7]!) : null;

  if (
    raceDie === null ||
    ageCard === null ||
    contextCard === null ||
    n1 === null ||
    n2 === null
  ) {
    return null;
  }
  if (compact.length === 8 && genderDieParsed === null) return null;

  const race = raceFromD6(raceDie);
  const nameDice: [number, number] = [n1, n2];
  const name = lookupName(race, n1, n2);
  const contextText = contextByRank[contextCard.rank];
  const genderDie =
    genderDieParsed ??
    legacyGenderDie(raceDie, ageCard, contextCard, n1, n2);
  const gender = genderFromD6(genderDie);

  return {
    raceDie,
    race,
    agePersonalityCard: ageCard,
    contextCard,
    nameDice,
    name,
    contextText,
    genderDie,
    gender,
  };
}

export function decodeCharacterRollParam(raw: string): CharacterRoll | null {
  const compact = raw.trim().toUpperCase();
  if (
    compact.length !== 7 &&
    compact.length !== 8 &&
    compact.length !== 9 &&
    compact.length !== 10
  ) {
    return null;
  }

  const baseStr =
    compact.length === 9 || compact.length === 10
      ? compact.slice(0, 8)
      : compact;
  const tail =
    compact.length === 9 || compact.length === 10 ? compact.slice(8) : "";

  if (baseStr.length !== 7 && baseStr.length !== 8) return null;
  if (compact.length === 9 || compact.length === 10) {
    if (baseStr.length !== 8) return null;
  }

  const base = decodeCharacterRollBase(baseStr);
  if (!base) return null;

  if (tail.length === 0) {
    return base;
  }

  if (tail.length === 1) {
    if (base.contextCard.rank !== "7") return null;
    const contextSevenDie = parseRaceDie(tail);
    if (contextSevenDie === null) return null;
    return { ...base, contextSevenDie };
  }

  if (tail.length === 2) {
    if (base.contextCard.rank !== "10") return null;
    const a = parseNameDie(tail[0]!);
    const b = parseNameDie(tail[1]!);
    if (a === null || b === null) return null;
    const contextSpokenNameDice: [number, number] = [a, b];
    const contextSpokenName = lookupName(base.race, a, b);
    return { ...base, contextSpokenNameDice, contextSpokenName };
  }

  return null;
}
