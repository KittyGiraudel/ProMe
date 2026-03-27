import {
  areHexNeighbors,
  formatDisplayedCellReference,
  getDisplayedCellLabel,
  getGlobalFromSheetCell,
  toHexKey,
} from '@/lib/hex/coordinates'
import { MapCellContextMenu } from './MapCellContextMenu'
import type { MapDisplayProps } from './MapDisplay'
import { useMapActions } from './useMapActions'
import './MapHex.css'
import { useMapState } from './useMapState'

type MapHexProps = MapDisplayProps & {
  ri: number
  ci: number
}

export function MapHex({
  ri,
  ci,
  sheet,
  selectedPosition,
  onSelectCell,
}: MapHexProps) {
  const { cellsByKey, journalIndexByCell, mapState } = useMapState()
  const { setBiomeAt, setRandomBiomeAt, moveToCell, setIconAt, clearCellAt } =
    useMapActions()
  const { currentPosition } = mapState

  const global = getGlobalFromSheetCell(sheet, ri, ci)
  const key = toHexKey(global)
  const cell = cellsByKey.get(key)
  const isCurrent =
    currentPosition.q === global.q && currentPosition.r === global.r
  const isSelected =
    selectedPosition?.q === global.q && selectedPosition?.r === global.r
  const biome = cell?.biome
  const icon = cell?.icon
  const localLabel = getDisplayedCellLabel(global)
  const canMoveHere = areHexNeighbors(currentPosition, global)
  const cellRef = formatDisplayedCellReference(global)
  const journalLinks = journalIndexByCell.get(cellRef) ?? []
  const journalEntryCount = journalLinks.length

  return (
    <div
      id={formatDisplayedCellReference(global)}
      className='MapHex'
      data-q={global.q}
      data-r={global.r}
      data-coord={localLabel}
      data-biome={biome ?? 'unexplored'}
      data-icon={icon ?? ''}
      data-current={isCurrent ? 'true' : 'false'}
      data-selected={isSelected ? 'true' : 'false'}
      data-reachable={canMoveHere ? 'true' : 'false'}>
      <MapCellContextMenu
        coord={global}
        currentBiome={biome}
        hasStoredIcon={Boolean(icon)}
        hasCellContent={Boolean(biome || icon)}
        canMoveHere={canMoveHere}
        title={localLabel}
        coordLabel={localLabel}
        journalLinks={journalLinks}
        onSelectCell={onSelectCell}
        onAssignBiome={setBiomeAt}
        onAssignRandomBiome={setRandomBiomeAt}
        onMoveTo={moveToCell}
        onSetIcon={setIconAt}
        onClearCell={clearCellAt}
      />
      {journalEntryCount > 0 ? (
        <span className='Map__JournalCount'>{journalEntryCount}</span>
      ) : null}
      <span className='Map__Icon'>{icon ?? ''}</span>
    </div>
  )
}
