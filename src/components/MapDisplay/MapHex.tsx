import { useMemo } from 'react'
import {
  areHexNeighbors,
  formatDisplayedCellReference,
  getDisplayedCellLabel,
  getGlobalFromSheetCell,
} from '@/lib/hex/coordinates'
import { MapCellContextMenu } from './MapCellContextMenu'
import type { MapDisplayProps } from './MapDisplay'
import { useJournalIndex, useMapState } from './useMapState'
import { BiomeId } from '@/lib/character/types'
import './MapHex.css'

type MapHexProps = MapDisplayProps & {
  ri: number
  ci: number
}

type MapHexState = {
  label: string
  isCurrent: boolean
  isSelected: boolean
  isReachable: boolean
  icon: string | undefined
  biome: BiomeId | 'unexplored' | undefined
}

const useHexState = ({
  ri,
  ci,
  selectedCell,
  sheet,
}: {
  selectedCell: MapDisplayProps['selectedCell']
  sheet: MapDisplayProps['sheet']
  ri: MapHexProps['ri']
  ci: MapHexProps['ci']
}): MapHexState => {
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
    () => areHexNeighbors(currentPosition, global),
    [currentPosition, global]
  )
  const { icon, biome } = getCellState(global)
  const label = useMemo(() => getDisplayedCellLabel(global), [global])

  return useMemo(
    () => ({
      isSelected,
      isCurrent,
      isReachable,
      icon,
      biome,
      label,
    }),
    [isSelected, isCurrent, isReachable, icon, biome, label]
  )
}

export function MapHex({
  ri,
  ci,
  sheet,
  selectedCell,
  selectCell,
}: MapHexProps) {
  const { getLinksForCell } = useJournalIndex()
  const { isCurrent, isSelected, isReachable, icon, biome, label } =
    useHexState({
      ri,
      ci,
      sheet,
      selectedCell,
    })
  const global = useMemo(
    () => getGlobalFromSheetCell(sheet, ri, ci),
    [sheet, ri, ci]
  )
  const journalRefCount = getLinksForCell(global).length
  const id = useMemo(() => formatDisplayedCellReference(global), [global])

  if (isSelected) console.log(id, label, isSelected)
  return (
    <div
      id={id}
      className='MapHex'
      data-q={global.q}
      data-r={global.r}
      data-coord={label}
      data-biome={biome ?? 'unexplored'}
      data-icon={icon ?? ''}
      data-current={isCurrent}
      data-selected={isSelected}
      data-reachable={isReachable}>
      <MapCellContextMenu
        coord={global}
        isReachable={isReachable}
        label={label}
        coordLabel={label}
        selectCell={selectCell}
      />
      {journalRefCount > 0 ? (
        <span className='Map__JournalCount'>{journalRefCount}</span>
      ) : null}
      <span className='Map__Icon'>{icon ?? ''}</span>
    </div>
  )
}
