import type { MapDisplayProps } from '@/components/MapDisplay/MapDisplay'
import { MapHex } from '@/components/MapHex/MapHex'
import { MAP_COLS } from '@/lib/hex/coordinates'

import './MapRow.css'

type MapRowProps = MapDisplayProps & {
  index: number
}

export function MapRow({
  index,
  sheet,
  selectedCell,
  selectCell,
}: MapRowProps) {
  return (
    <div className='MapRow' key={`row-${index}`}>
      {Array.from({ length: MAP_COLS }, (_, ci) => {
        return (
          <MapHex
            key={index + '-' + ci}
            ri={index}
            ci={ci}
            sheet={sheet}
            selectedCell={selectedCell}
            selectCell={selectCell}
          />
        )
      })}
    </div>
  )
}
