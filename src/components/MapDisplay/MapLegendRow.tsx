import { colLabelFromIndex, MAP_COLS } from '@/lib/hex/coordinates'
import './MapLegendRow.css'

export function MapLegendRow({
  offset = 0,
  position,
}: {
  offset: number
  position: 'top' | 'bottom'
}) {
  return (
    <div className={`MapLegendRow MapLegendRow--${position}`}>
      {Array.from({ length: MAP_COLS }, (_, ci) => (
        <div className='MapLegendRow__Item' key={`col-${ci * 2 + offset}`}>
          {colLabelFromIndex(ci * 2 + offset)}
        </div>
      ))}
    </div>
  )
}
