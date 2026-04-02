import type { BiomeId } from '@/lib/types'

export type GatherableBiomeId = Exclude<BiomeId, 'floodedPlains'>

export type GatheringEntry =
  | { type: 'collectible'; regex: RegExp }
  | { type: 'money'; regex: RegExp }
  | { type: 'choice' }
  | { type: 'none' }

type BiomeGathering = Record<'1' | '2' | '3' | '4' | '5' | '6', GatheringEntry>

// Matches "N Item" or "N × Item" (FR format uses ×, EN format may not)
const ITEM_REGEX = /^(\d+)\s+(?:×\s+)?(.+)$/
// Matches "N,NNN Item" or "N,NNN × Item" — for comma-formatted quantities
const ITEM_REGEX_WITH_COMMA = /^([\d, ]+)\s+(?:×\s+)?(.+)$/

export const GATHERING_SCHEMA: Record<BiomeId, BiomeGathering | null> = {
  floodedPlains: null,
  shadowForest: {
    '1': { type: 'collectible', regex: ITEM_REGEX },
    '2': { type: 'collectible', regex: ITEM_REGEX },
    '3': { type: 'collectible', regex: ITEM_REGEX },
    '4': { type: 'collectible', regex: ITEM_REGEX },
    '5': { type: 'collectible', regex: ITEM_REGEX },
    '6': { type: 'choice' },
  },
  mushroomJungle: {
    '1': { type: 'money', regex: ITEM_REGEX },
    '2': { type: 'collectible', regex: ITEM_REGEX },
    '3': { type: 'collectible', regex: ITEM_REGEX },
    '4': { type: 'collectible', regex: ITEM_REGEX },
    '5': { type: 'collectible', regex: ITEM_REGEX },
    '6': { type: 'choice' },
  },
  fieldSea: {
    '1': { type: 'money', regex: ITEM_REGEX },
    '2': { type: 'collectible', regex: ITEM_REGEX },
    '3': { type: 'collectible', regex: ITEM_REGEX },
    '4': { type: 'collectible', regex: ITEM_REGEX },
    '5': { type: 'collectible', regex: ITEM_REGEX },
    '6': { type: 'choice' },
  },
  silentDesert: {
    '1': { type: 'money', regex: ITEM_REGEX },
    '2': { type: 'collectible', regex: ITEM_REGEX },
    '3': { type: 'collectible', regex: ITEM_REGEX },
    '4': { type: 'collectible', regex: ITEM_REGEX },
    '5': { type: 'collectible', regex: ITEM_REGEX },
    '6': { type: 'choice' },
  },
  giganticGardens: {
    '1': { type: 'none' },
    '2': { type: 'money', regex: ITEM_REGEX },
    '3': { type: 'money', regex: ITEM_REGEX_WITH_COMMA },
    '4': { type: 'none' },
    '5': { type: 'none' },
    '6': { type: 'choice' },
  },
}
