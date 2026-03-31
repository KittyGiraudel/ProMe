'use client'

import { useSettings } from '@/components/PageSettings/SettingsContext'
import type { HexCoordinate } from '@/lib/character/types'
import { MAP_ROWS, type SheetCoordinate } from '@/lib/hex/coordinates'
import { MapLegendCol } from './MapLegendCol'
import { MapLegendRow } from './MapLegendRow'
import { MapRow } from './MapRow'
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
  const { settings } = useSettings()
  const showAxes = settings.map.coordinatesDisplay !== 'hexagons'

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
