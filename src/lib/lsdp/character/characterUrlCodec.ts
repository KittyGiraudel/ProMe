import { lookupName } from "./data/namesByRace";
import { genderFromD6, raceFromD6 } from "./maps";
import type { CharacterRoll } from "./generate";
import { contextByRank } from "./data/contextByRank";
import { RANKS, type PlayingCard, type Rank, type Suit } from "../types";

const SUIT_TO_CODE: Record<Suit, string> = {
  hearts: "H",
  diamonds: "D",
  clubs: "C",
  spades: "S",
};

const CODE_TO_SUIT: Record<string, Suit> = {
  H: "hearts",
  D: "diamonds",
  C: "clubs",
  S: "spades",
};

function rankToCode(rank: Rank): string {
  return rank === "10" ? "T" : rank;
}

function codeToRank(c: string): Rank | null {
  if (c === "T") return "10";
  if (/^[2-9]$/.test(c)) return c as Rank;
  if (c === "J" || c === "Q" || c === "K" || c === "A") return c;
  return null;
}

function encodeCard(card: PlayingCard): string {
  const suit = SUIT_TO_CODE[card.suit];
  const rank = rankToCode(card.rank);
  return `${suit}${rank}`;
}

function decodeCard(pair: string): PlayingCard | null {
  if (pair.length !== 2) return null;
  const suit = CODE_TO_SUIT[pair[0]!.toUpperCase()];
  const rank = codeToRank(pair[1]!.toUpperCase());
  if (!suit || !rank) return null;
  return { suit, rank };
}

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

/** Compact query: 1D6 race, 2× card, 2D6 name, 1D6 gender — 8 chars. Legacy 7-char URLs omit gender (derived deterministically). */
export function encodeCharacterRoll(roll: CharacterRoll): string {
  return `${roll.raceDie}${encodeCard(roll.agePersonalityCard)}${encodeCard(roll.contextCard)}${roll.nameDice[0]}${roll.nameDice[1]}${roll.genderDie}`;
}

export function decodeCharacterRollParam(raw: string): CharacterRoll | null {
  const compact = raw.trim().toUpperCase();
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
