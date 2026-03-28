'use client'

import type { HexCoordinate } from '@/lib/character/types'
import { MAP_ROWS, type SheetCoordinate } from '@/lib/hex/coordinates'
import { MapRow } from './MapRow'
import { MapLegendRow } from './MapLegendRow'
import { MapLegendCol } from './MapLegendCol'
import './MapDisplay.css'

export type MapDisplayProps = {
  sheet: SheetCoordinate
  selectedCell: HexCoordinate | null
  selectCell: (coord: HexCoordinate) => void
}

export function MapDisplay({
  sheet,
  selectedCell,
  selectCell,
}: MapDisplayProps) {
  return (
    <div className='Map'>
      <MapLegendRow position='top' offset={0} />
      <MapLegendRow position='top' offset={1} />
      <MapLegendCol position='left' />

      <div className='Map__Inner'>
        {Array.from({ length: MAP_ROWS }, (_, ri) => (
          <MapRow
            key={ri}
            index={ri}
            sheet={sheet}
            selectedCell={selectedCell}
            selectCell={selectCell}
          />
        ))}
      </div>

      <MapLegendCol position='right' />
      <MapLegendRow position='bottom' offset={1} />
      <MapLegendRow position='bottom' offset={0} />
    </div>
  )
}
