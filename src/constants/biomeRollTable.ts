import type { BiomeId } from '@/lib/types'

export type BiomeRollEntry = {
  biome: BiomeId
  tileCount: number
}

/**
 * Rulebook-aligned 1d6 biome roll table.
 * Order matters and maps directly to dice results 1..6.
 */
export const BIOME_ROLL_TABLE: readonly BiomeRollEntry[] = [
  { biome: 'shadowWoods', tileCount: 3 },
  { biome: 'sunkenSavannah', tileCount: 3 },
  { biome: 'mushroomJungle', tileCount: 2 },
  { biome: 'prairieSea', tileCount: 3 },
  { biome: 'silentWastes', tileCount: 2 },
  { biome: 'titanGarden', tileCount: 3 },
] as const
