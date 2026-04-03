import { useCallback, useMemo } from 'react'
import { useWatchedMap } from '@/hooks/useCharacterSheetDerived'
import { normalizeMapState } from '@/lib/character/mapState'
import { CellCoordinate, CharacterMapCell } from '@/lib/character/types'
import {
  formatDisplayedCellReference,
  getSheetCoordinate,
  SheetCoordinate,
  toCellKey,
} from '@/lib/map/coordinates'
import { BiomeId } from '@/lib/types'

export type CharacterCellData = {
  ref: string
  coord: CellCoordinate
  sheet: SheetCoordinate
  biome?: BiomeId
  icon?: string
}

export const useMapState = () => {
  const { map } = useWatchedMap()
  const mapState = normalizeMapState(map)
  const cellsByKey = useMemo(() => {
    const next = new Map<string, CharacterMapCell>()
    for (const cell of mapState.cells) next.set(toCellKey(cell), cell)
    return next
  }, [mapState.cells])

  const getCellState = useCallback(
    (coord: CellCoordinate): CharacterCellData => {
      const sheet = getSheetCoordinate(coord)
      const existing = cellsByKey.get(toCellKey(coord))
      const ref = formatDisplayedCellReference(coord)
      return {
        ref,
        coord,
        sheet,
        biome: existing?.biome,
        icon: existing?.icon,
      }
    },
    [cellsByKey]
  )

  return useMemo(() => ({ mapState, getCellState }), [mapState, getCellState])
}
