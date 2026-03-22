import type { AgeBand, Personality, Race, Rank, Suit } from "../types";

export function raceFromD6(value: number): Race {
  if (value <= 2) return "bruja";
  if (value <= 4) return "cucurbitus";
  if (value === 5) return "kiore";
  return "mousseron";
}

export function ageBandFromSuit(suit: Suit): AgeBand {
  switch (suit) {
    case "hearts":
      return "child";
    case "diamonds":
      return "teenager";
    case "clubs":
      return "adult";
    case "spades":
      return "elderly";
  }
}

export function personalityFromRank(rank: Rank): Personality {
  switch (rank) {
    case "A":
      return "enthusiast";
    case "2":
      return "poetic";
    case "3":
      return "sarcastic";
    case "4":
      return "charismatic";
    case "5":
      return "grumpy";
    case "6":
      return "curious";
    case "7":
      return "friendly";
    case "8":
      return "embarrassed";
    case "9":
      return "hasty";
    case "10":
      return "dreamy";
    case "J":
      return "calm";
    case "Q":
      return "joyful";
    case "K":
      return "sad";
    default: {
      const _exhaustive: never = rank;
      return _exhaustive;
    }
  }
}
