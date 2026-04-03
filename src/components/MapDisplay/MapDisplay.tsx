'use client'

import { MapLegendCol } from '@/components/MapLegendCol/MapLegendCol'
import { MapLegendRow } from '@/components/MapLegendRow/MapLegendRow'
import { MapRow } from '@/components/MapRow/MapRow'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import type { CellCoordinate } from '@/lib/character/types'
import { MAP_ROWS, type SheetCoordinate } from '@/lib/map/coordinates'

import './MapDisplay.css'

export type MapDisplayProps = {
  sheet: SheetCoordinate
  selectedCell: CellCoordinate | null
  selectCell: (coord: CellCoordinate) => void
}

export function MapDisplay({
  sheet,
  selectedCell,
  selectCell,
}: MapDisplayProps) {
  const { settings } = useSettings()
  const showAxes = settings.map.coordinatesDisplay !== 'cells'

  return (
    <div className='MapScroller'>
      <div className='Map'>
        {showAxes && (
          <>
            <MapLegendRow position='top' offset={0} />
            <MapLegendRow position='top' offset={1} />
            <MapLegendCol position='left' />
          </>
        )}

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

        {showAxes && (
          <>
            <MapLegendCol position='right' />
            <MapLegendRow position='bottom' offset={1} />
            <MapLegendRow position='bottom' offset={0} />
          </>
        )}
      </div>
    </div>
  )
}
