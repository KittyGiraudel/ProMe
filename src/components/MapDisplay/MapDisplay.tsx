'use client'

import type {
  BiomeId,
  CharacterMapCell,
  HexCoordinate,
} from '@/lib/character/types'
import {
  MAP_COLS,
  MAP_ROWS,
  areHexNeighbors,
  colLabelFromIndex,
  formatDisplayedCellReference,
  getDisplayedCellLabel,
  getGlobalFromSheetCell,
  rowLabelFromIndex,
  toHexKey,
  type SheetCoordinate,
} from '@/lib/hex/coordinates'
import type { JournalEntryLink } from '@/lib/journal/cellReferenceIndex'
import './MapDisplay.css'
import React from 'react'
import { MapCellContextMenu } from './MapCellContextMenu'

type MapDisplayProps = {
  sheet: SheetCoordinate
  cellsByKey: Map<string, CharacterMapCell>
  journalIndexByCell: Map<string, JournalEntryLink[]>
  currentPosition: HexCoordinate
  selectedPosition: HexCoordinate | null
  onSelectCell: (coord: HexCoordinate) => void
  onAssignBiome: (coord: HexCoordinate, biome: BiomeId | undefined) => void
  onAssignRandomBiome: (coord: HexCoordinate) => void
  onMoveTo: (coord: HexCoordinate) => void
  onSetIcon: (coord: HexCoordinate, icon: string | undefined) => void
  onClearCell: (coord: HexCoordinate) => void
}

export function MapDisplay({
  sheet,
  cellsByKey,
  journalIndexByCell,
  currentPosition,
  selectedPosition,
  onSelectCell,
  onAssignBiome,
  onAssignRandomBiome,
  onMoveTo,
  onSetIcon,
  onClearCell,
}: MapDisplayProps) {
  return (
    <div className='MapDisplay'>
      <div className='MapDisplay__Inner'>
        <div className='MapDisplay__LegendRow MapDisplay__LegendRow--top'>
          {Array.from({ length: MAP_COLS }, (_, ci) => (
            <React.Fragment key={`col-${ci * 2}`}>
              <div className='MapDisplay__LegendItem'>
                {colLabelFromIndex(ci * 2)}
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className='MapDisplay__LegendRow MapDisplay__LegendRow--top'>
          {Array.from({ length: MAP_COLS }, (_, ci) => (
            <React.Fragment key={`col-${ci * 2 + 1}`}>
              <div className='MapDisplay__LegendItem'>
                {colLabelFromIndex(ci * 2 + 1)}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className='MapDisplay__LegendCol MapDisplay__LegendCol--left'>
          {Array.from({ length: MAP_ROWS }, (_, ri) => (
            <div className='MapDisplay__LegendItem' key={`legend-left-${ri}`}>
              {rowLabelFromIndex(ri)}
            </div>
          ))}
        </div>

        {Array.from({ length: MAP_ROWS }, (_, ri) => (
          <div className='MapDisplay__Row' key={`row-${ri}`}>
            {Array.from({ length: MAP_COLS }, (_, ci) => {
              const global = getGlobalFromSheetCell(sheet, ri, ci)
              const key = toHexKey(global)
              const cell = cellsByKey.get(key)
              const isCurrent =
                currentPosition.q === global.q && currentPosition.r === global.r
              const isSelected =
                selectedPosition?.q === global.q &&
                selectedPosition?.r === global.r
              const biome = cell?.biome
              const icon = cell?.icon
              const localLabel = getDisplayedCellLabel(global)
              const canMoveHere = areHexNeighbors(currentPosition, global)
              const cellRef = formatDisplayedCellReference(global)
              const journalLinks = journalIndexByCell.get(cellRef) ?? []
              const journalEntryCount = journalLinks.length

              return (
                <div
                  key={localLabel}
                  id={formatDisplayedCellReference(global)}
                  className='MapDisplay__Hex'
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
                    onAssignBiome={onAssignBiome}
                    onAssignRandomBiome={onAssignRandomBiome}
                    onMoveTo={onMoveTo}
                    onSetIcon={onSetIcon}
                    onClearCell={onClearCell}
                  />
                  {journalEntryCount > 0 ? (
                    <span className='MapDisplay__JournalCount'>
                      {journalEntryCount}
                    </span>
                  ) : null}
                  <span className='MapDisplay__Icon'>{icon ?? ''}</span>
                </div>
              )
            })}
          </div>
        ))}

        <div className='MapDisplay__LegendCol MapDisplay__LegendCol--right'>
          {Array.from({ length: MAP_ROWS }, (_, ri) => (
            <div className='MapDisplay__LegendItem' key={`legend-right-${ri}`}>
              {rowLabelFromIndex(ri)}
            </div>
          ))}
        </div>

        <div className='MapDisplay__LegendRow MapDisplay__LegendRow--bottom'>
          {Array.from({ length: MAP_COLS }, (_, ci) => (
            <React.Fragment key={`col-${ci * 2 + 1}`}>
              <div className='MapDisplay__LegendItem'>
                {colLabelFromIndex(ci * 2 + 1)}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className='MapDisplay__LegendRow MapDisplay__LegendRow--bottom'>
          {Array.from({ length: MAP_COLS }, (_, ci) => (
            <React.Fragment key={`col-${ci * 2}`}>
              <div className='MapDisplay__LegendItem'>
                {colLabelFromIndex(ci * 2)}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
