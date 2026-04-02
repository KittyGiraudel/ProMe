import { toCellKey } from '@/lib/map/coordinates'
import type { PossibleBiomeId } from '../types'
import { normalizeCharacterMapState } from './model'

export function biomeAtCurrentMapPosition(map: unknown): PossibleBiomeId {
  const state = normalizeCharacterMapState(map)
  const posKey = toCellKey(state.currentPosition)

  for (const cell of state.cells)
    if (toCellKey(cell) === posKey) return cell.biome ?? 'unexplored'

  return 'unexplored'
}
