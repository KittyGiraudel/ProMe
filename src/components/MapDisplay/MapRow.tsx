import { MAP_COLS } from '@/lib/hex/coordinates'
import { MapHex } from './MapHex'
import type { MapDisplayProps } from './MapDisplay'
import './MapRow.css'

type MapRowProps = MapDisplayProps & {
  index: number
}

export function MapRow({
  index,
  sheet,
  selectedPosition,
  onSelectCell,
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
            selectedPosition={selectedPosition}
            onSelectCell={onSelectCell}
          />
        )
      })}
    </div>
  )
}
