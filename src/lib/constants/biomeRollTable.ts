import type { BiomeId } from '@/lib/character/types'

export type BiomeRollEntry = {
  biome: BiomeId
  tileCount: number
}

/**
 * Rulebook-aligned 1d6 biome roll table.
 * Order matters and maps directly to dice results 1..6.
 */
export const BIOME_ROLL_TABLE: readonly BiomeRollEntry[] = [
  { biome: 'shadowForest', tileCount: 3 },
  { biome: 'floodedPlains', tileCount: 3 },
  { biome: 'mushroomJungle', tileCount: 2 },
  { biome: 'fieldSea', tileCount: 3 },
  { biome: 'silentDesert', tileCount: 2 },
  { biome: 'giganticGardens', tileCount: 3 },
] as const
