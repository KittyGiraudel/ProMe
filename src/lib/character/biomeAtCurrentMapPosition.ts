import { toHexKey } from '@/lib/hex/coordinates'
import type { PossibleBiomeId } from '../types'
import { normalizeCharacterMapState } from './model'

export function biomeAtCurrentMapPosition(map: unknown): PossibleBiomeId {
  const state = normalizeCharacterMapState(map)
  const posKey = toHexKey(state.currentPosition)

  for (const cell of state.cells)
    if (toHexKey(cell) === posKey) return cell.biome ?? 'unexplored'

  return 'unexplored'
}
