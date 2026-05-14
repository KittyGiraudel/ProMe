import type {
  AgeBand,
  Faction,
  Gender,
  Personality,
  Rank,
  Suit,
} from '@/lib/types'

export function factionFromD6(value: number): Faction {
  if (value <= 2) return 'bruja'
  if (value <= 4) return 'cucurbits'
  if (value === 5) return 'kiore'
  return 'mycelian'
}

/** D6 value that maps to `faction` via `factionFromD6` (stable encoding for URLs). */
export function canonicalFactionDie(faction: Faction): number {
  switch (faction) {
    case 'bruja':
      return 1
    case 'cucurbits':
      return 3
    case 'kiore':
      return 5
    case 'mycelian':
      return 6
  }
}

/** Optional 1D6: 1–2 man, 3–4 woman, 5 non-binary, 6 indeterminate. */
export function genderFromD6(value: number): Gender {
  if (value <= 2) return 'man'
  if (value <= 4) return 'woman'
  if (value === 5) return 'nonBinary'
  return 'indeterminate'
}

/** D6 value that maps to `gender` via `genderFromD6` (stable encoding for URLs). */
export function canonicalGenderDie(gender: Gender): number {
  switch (gender) {
    case 'man':
      return 1
    case 'woman':
      return 3
    case 'nonBinary':
      return 5
    case 'indeterminate':
      return 6
  }
}

export function ageBandFromSuit(suit: Suit): AgeBand {
  switch (suit) {
    case 'hearts':
      return 'child'
    case 'diamonds':
      return 'teenager'
    case 'clubs':
      return 'adult'
    case 'spades':
      return 'elderly'
  }
}

export function suitFromAgeBand(ageBand: AgeBand): Suit {
  switch (ageBand) {
    case 'child':
      return 'hearts'
    case 'teenager':
      return 'diamonds'
    case 'adult':
      return 'clubs'
    case 'elderly':
      return 'spades'
  }
}

export function personalityFromRank(rank: Rank): Personality {
  switch (rank) {
    case 'A':
      return 'enthusiast'
    case '2':
      return 'poetic'
    case '3':
      return 'sarcastic'
    case '4':
      return 'charismatic'
    case '5':
      return 'grumpy'
    case '6':
      return 'curious'
    case '7':
      return 'friendly'
    case '8':
      return 'shy'
    case '9':
      return 'hasty'
    case '10':
      return 'dreamy'
    case 'J':
      return 'quiet'
    case 'Q':
      return 'playful'
    case 'K':
      return 'sorrowful'
    default: {
      const _exhaustive: never = rank
      return _exhaustive
    }
  }
}

export function rankFromPersonality(personality: Personality): Rank {
  switch (personality) {
    case 'enthusiast':
      return 'A'
    case 'poetic':
      return '2'
    case 'sarcastic':
      return '3'
    case 'charismatic':
      return '4'
    case 'grumpy':
      return '5'
    case 'curious':
      return '6'
    case 'friendly':
      return '7'
    case 'shy':
      return '8'
    case 'hasty':
      return '9'
    case 'dreamy':
      return '10'
    case 'quiet':
      return 'J'
    case 'playful':
      return 'Q'
    case 'sorrowful':
      return 'K'
    default: {
      const _exhaustive: never = personality
      return _exhaustive
    }
  }
}
