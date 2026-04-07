import { PossibleBiomeId } from '@/lib/types'
import './MapVisual.css'

type CellType = PossibleBiomeId | 'current'

const GRID: Array<[CellType, string?]> = [
  ['unexplored'],
  ['shadowForest', '🌿'],
  ['shadowForest'],
  ['unexplored'],
  ['unexplored'],
  ['shadowForest'],
  ['unexplored'],
  ['fieldSea'],
  ['fieldSea'],
  ['current', '📍'],
  ['silentDesert'],
  ['silentDesert'],
  ['floodedPlains'],
  ['floodedPlains'],
  ['giganticGardens'],
  ['giganticGardens'],
  ['silentDesert', '🌵'],
  ['silentDesert'],
  ['unexplored'],
  ['unexplored'],
  ['unexplored'],
  ['unexplored'],
]

export function MapVisual() {
  return (
    <div className='MapVisualWrapper' aria-hidden='true'>
      <div className='MapVisual'>
        {GRID.map(([type, icon], i) => (
          <div
            key={i}
            data-biome={type}
            className={`MapVisual__cell MapVisual__cell--${type} Pattern`}>
            <span>{icon}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
