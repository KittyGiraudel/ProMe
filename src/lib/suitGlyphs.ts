import type { Suit } from "./types";

export function suitIsRed(suit: Suit): boolean {
  return suit === "hearts" || suit === "diamonds";
}
