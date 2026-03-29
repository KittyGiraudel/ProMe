import type { Rank, Suit } from "./types";

export function suitIsRed(suit: Suit): boolean {
  return suit === "hearts" || suit === "diamonds";
}

export function isFaceRank(rank: Rank): boolean {
  return rank === "J" || rank === "Q" || rank === "K";
}