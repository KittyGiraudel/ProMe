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
  'shadowForest',
  'floodedPlains',
  'mushroomJungle',
  'fieldSea',
  'silentDesert',
  'titanGardens',
] as const

export const ARCHETYPES: readonly Archetype[] = [
  'warrior',
  'pilgrim',
  'bard',
] as const

/** Add one entry per biome once fonts are chosen.
 *  Biomes with no entry fall back to the serif stack in BiomePage.css. */
export const BIOME_FONTS: Partial<
  Record<
    BiomeId,
    {
      /** CSS font-family value, used in the title's font-family declaration. */
      family: string
      /** Exact Google Fonts family name for the URL, e.g. "Caesar+Dressing". */
      googleFamily: string
    }
  >
> = {
  // Example — replace with final choices:
  shadowForest: { family: 'Caesar Dressing', googleFamily: 'Caesar+Dressing' },
  mushroomJungle: { family: 'Shizuru', googleFamily: 'Shizuru' },
  floodedPlains: { family: 'Rubik Puddles', googleFamily: 'Rubik+Puddles' },
  titanGardens: {
    family: 'Mountains of Christmas',
    googleFamily: 'Mountains+of+Christmas',
  },
  fieldSea: { family: 'Mystery Quest', googleFamily: 'Mystery+Quest' },
  silentDesert: {
    family: 'Fredericka the Great',
    googleFamily: 'Fredericka+the+Great',
  },
}
