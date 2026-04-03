import { FormInstance } from 'antd'
import { normalizeCharacterMapState } from '@/lib/character/model'
import { toCellKey } from '@/lib/map/coordinates'
import type { PossibleBiomeId } from '@/lib/types'
import { useWatchedMap } from './useCharacterSheetDerived'

export function useBiomeAtCurrentMapPosition(
  form?: FormInstance
): PossibleBiomeId {
  const map = useWatchedMap(form)
  const state = normalizeCharacterMapState(map)
  const posKey = toCellKey(state.currentPosition)

  for (const cell of state.cells)
    if (toCellKey(cell) === posKey) return cell.biome ?? 'unexplored'

  return 'unexplored'
}
