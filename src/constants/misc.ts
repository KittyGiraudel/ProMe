import { Archetype } from '../lib/character/types'
import { AgeBand, BiomeId, Faction, Gender, Rank } from '../lib/types'

export const SUITS = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
}

export const DICE = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

export const RANKS: readonly Rank[] = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
] as const

export const AGE_BANDS: readonly AgeBand[] = [
  'child',
  'teenager',
  'adult',
  'elderly',
] as const

export const GENDERS: readonly Gender[] = [
  'man',
  'woman',
  'nonBinary',
  'indeterminate',
] as const

export const FACTIONS: readonly Faction[] = [
  'bruja',
  'cucurbitus',
  'kiore',
  'mousseron',
] as const

export const BIOME_IDS: readonly BiomeId[] = [
  'shadowWoods',
  'sunkenSavanna',
  'mushroomJungle',
  'prairieSea',
  'silentWastes',
  'titanGarden',
] as const

export const ARCHETYPES: readonly Archetype[] = [
  'swordbearer',
  'wanderer',
  'troubadour',
] as const
