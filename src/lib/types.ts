export type Race = "bruja" | "cucurbitus" | "kiore" | "mousseron";

export const RACES: readonly Race[] = [
  "bruja",
  "cucurbitus",
  "kiore",
  "mousseron",
] as const;

/** Optional table aid: 1D6 gender roll (not core rules). */
export type Gender = "man" | "woman" | "nonBinary" | "indeterminate";

export const GENDERS: readonly Gender[] = [
  "man",
  "woman",
  "nonBinary",
  "indeterminate",
] as const;

export type Suit = "hearts" | "diamonds" | "clubs" | "spades";

/** Playing-card rank (display names in `messages/fr.ts` → `copy.ranks`). */
export type Rank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

export type AgeBand = "child" | "teenager" | "adult" | "elderly";

export const AGE_BANDS: readonly AgeBand[] = [
  "child",
  "teenager",
  "adult",
  "elderly",
] as const;

export type Personality =
  | "enthusiast"
  | "poetic"
  | "sarcastic"
  | "charismatic"
  | "grumpy"
  | "curious"
  | "friendly"
  | "embarrassed"
  | "hasty"
  | "dreamy"
  | "calm"
  | "joyful"
  | "sad";

export type PlayingCard = {
  suit: Suit;
  rank: Rank;
};

export const RANKS: readonly Rank[] = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
] as const;

export const SUITS: readonly Suit[] = [
  "hearts",
  "diamonds",
  "clubs",
  "spades",
] as const;

export function isFaceRank(rank: Rank): boolean {
  return rank === "J" || rank === "Q" || rank === "K";
}
