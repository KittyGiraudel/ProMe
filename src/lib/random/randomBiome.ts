import { BIOME_ROLL_TABLE } from '@/constants/biomeRollTable'
import { defaultRng, pickRandom } from '@/lib/random/rng'
import type { BiomeId } from '@/lib/types'

export type RandomBiomeResult = {
  biome: BiomeId
  totalTiles: number
  additionalTilesToMark: number
}

export function getRandomBiomeResult(
  rng: () => number = defaultRng()
): RandomBiomeResult {
  const result = pickRandom(rng, BIOME_ROLL_TABLE) ?? BIOME_ROLL_TABLE[0]
  const additionalTilesToMark = Math.max(0, result.tileCount - 1)
  return {
    biome: result.biome,
    totalTiles: result.tileCount,
    additionalTilesToMark,
  }
}
