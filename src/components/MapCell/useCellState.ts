import { useMemo } from 'react'
import { MapDisplayProps } from '@/components/MapDisplay/MapDisplay'
import { useMapState } from '@/components/MapDisplay/useMapState'
import {
  areCellsNeighbors,
  getDisplayedCellLabel,
  getGlobalFromSheetCell,
  isCoreCell,
} from '@/lib/map/coordinates'
import { PossibleBiomeId } from '@/lib/types'
import { MapCellProps } from './MapCell'

type MapCellState = {
  label: string
  isCurrent: boolean
  isSelected: boolean
  isReachable: boolean
  isCore: boolean
  icon: string | undefined
  biome: PossibleBiomeId | undefined
}

export const useCellState = ({
  ri,
  ci,
  selectedCell,
  sheet,
}: {
  selectedCell: MapDisplayProps['selectedCell']
  sheet: MapDisplayProps['sheet']
  ri: MapCellProps['ri']
  ci: MapCellProps['ci']
}): MapCellState => {
  const { mapState, getCellState } = useMapState()
  const global = useMemo(
    () => getGlobalFromSheetCell(sheet, ri, ci),
    [sheet, ri, ci]
  )
  const { currentPosition } = mapState
  const isCurrent =
    currentPosition.q === global.q && currentPosition.r === global.r
  const isSelected =
    selectedCell?.q === global.q && selectedCell?.r === global.r
  const isReachable = useMemo(
    () => areCellsNeighbors(currentPosition, global),
    [currentPosition, global]
  )
  const { icon, biome } = getCellState(global) ?? {
    icon: undefined,
    biome: undefined,
  }
  const label = useMemo(() => getDisplayedCellLabel(global), [global])
  const isCore = useMemo(() => isCoreCell(global), [global])

  return useMemo(
    () => ({
      isSelected,
      isCurrent,
      isReachable,
      isCore,
      icon,
      biome,
      label,
    }),
    [isSelected, isCurrent, isReachable, isCore, icon, biome, label]
  )
}
