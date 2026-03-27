'use client'

import type {
  BiomeId,
  CharacterMapCell,
  HexCoordinate,
} from '@/lib/character/types'
import { MAP_ROWS, type SheetCoordinate } from '@/lib/hex/coordinates'
import type { JournalEntryLink } from '@/lib/journal/cellReferenceIndex'
import './MapDisplay.css'
import { MapRow } from './MapRow'
import { MapLegendRow } from './MapLegendRow'
import { MapLegendCol } from './MapLegendCol'

export type MapDisplayProps = {
  sheet: SheetCoordinate
  selectedPosition: HexCoordinate | null
  onSelectCell: (coord: HexCoordinate) => void
}

export function MapDisplay({
  sheet,
  selectedPosition,
  onSelectCell,
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
            selectedPosition={selectedPosition}
            onSelectCell={onSelectCell}
          />
        ))}
      </div>

      <MapLegendCol position='right' />
      <MapLegendRow position='bottom' offset={1} />
      <MapLegendRow position='bottom' offset={0} />
    </div>
  )
}
