import { MAP_ROWS, rowLabelFromIndex } from '@/lib/hex/coordinates'
import './MapLegendCol.css'

export function MapLegendCol({ position }: { position: 'left' | 'right' }) {
  return (
    <div className={`MapLegendCol MapLegendCol--${position}`}>
      {Array.from({ length: MAP_ROWS }, (_, ri) => (
        <div className='MapLegendCol__Item' key={`legend-left-${ri}`}>
          {rowLabelFromIndex(ri)}
        </div>
      ))}
    </div>
  )
}
