import { type useTranslations } from 'next-intl'

export type BiomeId =
  | 'shadowWoods'
  | 'sunkenSavannah'
  | 'mushroomJungle'
  | 'prairieSea'
  | 'silentWastes'
  | 'titanGarden'

export type PossibleBiomeId = BiomeId | 'unexplored'

export type Faction = 'bruja' | 'cucurbits' | 'kiore' | 'mycelian'

export type Gender = 'man' | 'woman' | 'nonBinary' | 'indeterminate'

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'

export type Rank =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'
  | 'A'

export type AgeBand = 'child' | 'teenager' | 'adult' | 'elderly'

export type Personality =
  | 'enthusiast'
  | 'poetic'
  | 'sarcastic'
  | 'charismatic'
  | 'grumpy'
  | 'curious'
  | 'friendly'
  | 'embarrassed'
  | 'hasty'
  | 'dreamy'
  | 'calm'
  | 'joyful'
  | 'sad'

export type PlayingCard = {
  suit: Suit
  rank: Rank
}

export type TranslationKey = Parameters<
  ReturnType<typeof useTranslations<never>>
>[0]

export type TranslationParams = Parameters<
  ReturnType<typeof useTranslations<never>>
>[1]
