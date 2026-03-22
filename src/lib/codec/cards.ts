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

export function encodePlayingCard(card: PlayingCard): string {
  const suit = SUIT_TO_CODE[card.suit];
  const rank = rankToCode(card.rank);
  return `${suit}${rank}`;
}

export function decodePlayingCardPair(pair: string): PlayingCard | null {
  if (pair.length !== 2) return null;
  const suit = CODE_TO_SUIT[pair[0]!.toUpperCase()];
  const rank = codeToRank(pair[1]!.toUpperCase());
  if (!suit || !rank) return null;
  return { suit, rank };
}

/** Decode a concatenation of 2-char card tokens; returns null if any pair is invalid. */
export function decodePlayingCardString(compact: string): PlayingCard[] | null {
  if (compact.length % 2 !== 0) return null;
  const cards: PlayingCard[] = [];
  for (let i = 0; i < compact.length; i += 2) {
    const c = decodePlayingCardPair(compact.slice(i, i + 2));
    if (!c) return null;
    cards.push(c);
  }
  return cards;
}
