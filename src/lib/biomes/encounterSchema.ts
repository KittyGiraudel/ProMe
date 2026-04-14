import type { BiomeId } from '@/lib/types'

/** Ordered list of die-result keys for each biome's encounter table.
 *  Keys match the shape in messages/{locale}.json → common.encounters.{biomeId}.
 *  Pipe-separated keys (e.g. "3|4") represent combined results displayed as "3–4". */
export const ENCOUNTER_SCHEMA: Record<BiomeId, string[]> = {
  shadowForest: ['1', '2|3', '4', '5|6'],
  floodedPlains: ['1', '2', '3|4', '5', '6'],
  mushroomJungle: ['1', '2', '3|4', '5', '6'],
  fieldSea: ['1', '2', '3', '4|5', '6'],
  silentDesert: ['1', '2', '3|4', '5|6'],
  titanGardens: ['1', '2|3', '4', '5', '6'],
}

/** Converts an encounter key to a display label: "3|4" → "3–4", "1" → "1". */
export function encounterKeyToLabel(key: string): string {
  return key.replace('|', '–')
}
