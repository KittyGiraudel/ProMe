import './MapVisual.css'

type CellType = 'unexplored' | 'forest' | 'purple' | 'blue' | 'sand' | 'current'

const GRID: Array<[CellType, string?]> = [
  ['unexplored'],
  ['forest', '🌿'],
  ['forest'],
  ['unexplored'],
  ['unexplored'],
  ['forest'],
  ['current', '📍'],
  ['purple'],
  ['purple'],
  ['unexplored'],
  ['sand'],
  ['sand'],
  ['blue'],
  ['blue'],
  ['unexplored'],
  ['unexplored'],
  ['sand'],
  ['sand'],
  ['unexplored'],
  ['unexplored'],
]

export function MapVisual() {
  return (
    <div className='MapVisual' aria-hidden='true'>
      {GRID.map(([type, icon], i) => (
        <div key={i} className={`MapVisual__cell MapVisual__cell--${type}`}>
          {icon}
        </div>
      ))}
    </div>
  )
}
