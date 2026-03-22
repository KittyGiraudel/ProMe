import { lookupName } from "./data/namesByRace";
import { raceFromD6 } from "./maps";
import type { CharacterRoll } from "./generate";
import { contextByRank } from "./data/contextByRank";
import type { PlayingCard, Rank, Suit } from "../types";

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

/** Compact query value: one D6, two cards (suit + rank), two D6 for name — 7 chars, e.g. `3HACK25`. */
export function encodeCharacterRoll(roll: CharacterRoll): string {
  return `${roll.raceDie}${encodeCard(roll.agePersonalityCard)}${encodeCard(roll.contextCard)}${roll.nameDice[0]}${roll.nameDice[1]}`;
}

export function decodeCharacterRollParam(raw: string): CharacterRoll | null {
  const compact = raw.trim().toUpperCase();
  if (compact.length !== 7) return null;

  const raceDie = parseRaceDie(compact[0]!);
  const ageCard = decodeCard(compact.slice(1, 3));
  const contextCard = decodeCard(compact.slice(3, 5));
  const n1 = parseNameDie(compact[5]!);
  const n2 = parseNameDie(compact[6]!);

  if (
    raceDie === null ||
    ageCard === null ||
    contextCard === null ||
    n1 === null ||
    n2 === null
  ) {
    return null;
  }

  const race = raceFromD6(raceDie);
  const nameDice: [number, number] = [n1, n2];
  const name = lookupName(race, n1, n2);
  const contextText = contextByRank[contextCard.rank];

  return {
    raceDie,
    race,
    agePersonalityCard: ageCard,
    contextCard,
    nameDice,
    name,
    contextText,
  };
}
