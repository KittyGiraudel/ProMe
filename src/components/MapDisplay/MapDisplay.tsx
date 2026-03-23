'use client'

import type {
  BiomeId,
  CharacterMapCell,
  HexCoordinate,
} from '@/lib/playerCharacter/types'
import {
  MAP_COLS,
  MAP_ROWS,
  colLabelFromIndex,
  getDisplayedCellLabel,
  getGlobalFromSheetCell,
  rowLabelFromIndex,
  toHexKey,
  type SheetCoordinate,
} from '@/lib/hex/coordinates'
import './MapDisplay.css'
import React from 'react'
import { CORE_Q, CORE_R } from '@/lib/playerCharacter/model'
import { MapCellContextMenu } from './MapCellContextMenu'

const biomeClassById: Record<BiomeId, string> = {
  shadowForest: 'Map__Hex--shadow-forest',
  floodedPlains: 'Map__Hex--flooded-plains',
  mushroomJungle: 'Map__Hex--mushroom-jungle',
  fieldSea: 'Map__Hex--field-sea',
  silentDesert: 'Map__Hex--silent-desert',
  titanesqueGardens: 'Map__Hex--titanesque-gardens',
}

type MapDisplayProps = {
  sheet: SheetCoordinate
  cellsByKey: Map<string, CharacterMapCell>
  currentPosition: HexCoordinate
  selectedPosition: HexCoordinate | null
  onSelectCell: (coord: HexCoordinate) => void
  onAssignBiome: (coord: HexCoordinate, biome: BiomeId | undefined) => void
  onMoveTo: (coord: HexCoordinate) => void
  onSetIcon: (coord: HexCoordinate, icon: string | undefined) => void
  onClearCell: (coord: HexCoordinate) => void
}

export function MapDisplay({
  sheet,
  cellsByKey,
  currentPosition,
  selectedPosition,
  onSelectCell,
  onAssignBiome,
  onMoveTo,
  onSetIcon,
  onClearCell,
}: MapDisplayProps) {
  return (
    <div className='Map'>
      <div className='Map__Inner'>
        <div className='Map__LegendRow Map__LegendRow--top'>
          {Array.from({ length: MAP_COLS }, (_, ci) => (
            <React.Fragment key={`col-${ci * 2}`}>
              <div className='Map__LegendItem'>{colLabelFromIndex(ci * 2)}</div>
            </React.Fragment>
          ))}
        </div>
        <div className='Map__LegendRow Map__LegendRow--top'>
          {Array.from({ length: MAP_COLS }, (_, ci) => (
            <React.Fragment key={`col-${ci * 2 + 1}`}>
              <div className='Map__LegendItem'>
                {colLabelFromIndex(ci * 2 + 1)}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className='Map__LegendCol Map__LegendCol--left'>
          {Array.from({ length: MAP_ROWS }, (_, ri) => (
            <div className='Map__LegendItem' key={`legend-left-${ri}`}>
              {rowLabelFromIndex(ri)}
            </div>
          ))}
        </div>

        {Array.from({ length: MAP_ROWS }, (_, ri) => (
          <div className='Map__Row' key={`row-${ri}`}>
            {Array.from({ length: MAP_COLS }, (_, ci) => {
              const global = getGlobalFromSheetCell(sheet, ri, ci)
              const key = toHexKey(global)
              const cell = cellsByKey.get(key)
              const isCore = global.q === CORE_Q && global.r === CORE_R
              const isCurrent =
                currentPosition.q === global.q && currentPosition.r === global.r
              const isSelected =
                selectedPosition?.q === global.q &&
                selectedPosition?.r === global.r
              const biome = isCore ? undefined : cell?.biome
              const icon = cell?.icon
              const localLabel = getDisplayedCellLabel(global)
              const biomeClassName = biome
                ? biomeClassById[biome]
                : isCore
                  ? 'Map__Hex--core'
                  : 'Map__Hex--unexplored'

              const className = [
                'Map__Hex',
                biomeClassName,
                isCurrent ? 'Map__Hex--current' : '',
                isSelected ? 'Map__Hex--selected' : '',
              ]
                .filter(Boolean)
                .join(' ')

              return (
                <div
                  key={localLabel}
                  className={className}
                  data-q={global.q}
                  data-r={global.r}>
                  <MapCellContextMenu
                    coord={global}
                    isCore={isCore}
                    title={localLabel}
                    coordLabel={localLabel}
                    onSelectCell={onSelectCell}
                    onAssignBiome={onAssignBiome}
                    onMoveTo={onMoveTo}
                    onSetIcon={onSetIcon}
                    onClearCell={onClearCell}
                  />
                  <span className='Map__Icon'>
                    {icon ?? (isCore ? '🏰' : '')}
                  </span>
                </div>
              )
            })}
          </div>
        ))}

        <div className='Map__LegendCol Map__LegendCol--right'>
          {Array.from({ length: MAP_ROWS }, (_, ri) => (
            <div className='Map__LegendItem' key={`legend-right-${ri}`}>
              {rowLabelFromIndex(ri)}
            </div>
          ))}
        </div>

        <div className='Map__LegendRow Map__LegendRow--bottom'>
          {Array.from({ length: MAP_COLS }, (_, ci) => (
            <React.Fragment key={`col-${ci * 2 + 1}`}>
              <div className='Map__LegendItem'>
                {colLabelFromIndex(ci * 2 + 1)}
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className='Map__LegendRow Map__LegendRow--bottom'>
          {Array.from({ length: MAP_COLS }, (_, ci) => (
            <React.Fragment key={`col-${ci * 2}`}>
              <div className='Map__LegendItem'>{colLabelFromIndex(ci * 2)}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
