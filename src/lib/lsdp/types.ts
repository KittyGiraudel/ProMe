export type Race = "bruja" | "cucurbitus" | "kiore" | "mousseron";

/** Optional table aid: 1D6 gender roll (not core rules). */
export type Gender = "man" | "woman" | "nonBinary" | "indeterminate";

export type Suit = "hearts" | "diamonds" | "clubs" | "spades";

/** Playing-card rank (display names come from locale messages, e.g. Valet/Dame/Roi). */
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
