import type { Suit } from "./types";

const SUIT_GLYPH: Record<Suit, string> = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};

export function suitGlyph(suit: Suit): string {
  return SUIT_GLYPH[suit];
}

export function suitIsRed(suit: Suit): boolean {
  return suit === "hearts" || suit === "diamonds";
}
