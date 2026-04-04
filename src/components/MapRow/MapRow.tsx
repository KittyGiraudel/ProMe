import { MapCell } from '@/components/MapCell/MapCell'
import type { MapDisplayProps } from '@/components/MapDisplay/MapDisplay'
import { MAP_COLS } from '@/lib/map/coordinates'

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
    <div className='MapRow'>
      {Array.from({ length: MAP_COLS }, (_, ci) => {
        return (
          <MapCell
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
