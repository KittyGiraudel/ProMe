import {useTranslations} from 'next-intl'

export type BiomeId =
  | 'shadowForest'
  | 'floodedPlains'
  | 'mushroomJungle'
  | 'fieldSea'
  | 'silentDesert'
  | 'giganticGardens'

export type Faction = "bruja" | "cucurbitus" | "kiore" | "mousseron";

export type Gender = "man" | "woman" | "nonBinary" | "indeterminate";

export type Suit = "hearts" | "diamonds" | "clubs" | "spades";

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

export type TranslationKey = Parameters<ReturnType<typeof useTranslations<never>>>[0]