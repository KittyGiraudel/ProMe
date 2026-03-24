import { toHexKey } from '@/lib/hex/coordinates'
import type { BiomeId } from './types'
import { normalizeCharacterMapState } from './model'

/** Biome on the cell where the character stands, or `unexplored` if missing / unset. */
export function biomeAtCurrentMapPosition(map: unknown): BiomeId | 'unexplored' {
  const state = normalizeCharacterMapState(map)
  const posKey = toHexKey(state.currentPosition)

  for (const cell of state.cells) 
    if (toHexKey(cell) === posKey) return cell.biome ?? 'unexplored'

  return 'unexplored'
}
