import { BiomeId } from '@/lib/character/types'
import { BiomeBubble } from '../BiomeBubble/BiomeBubble'
import './CoordChip.css'

export function CoordChip({
  biome,
  value,
}: {
  biome: BiomeId | 'unexplored'
  value: string
}) {
  return (
    <span className='coord-chip'>
      <BiomeBubble biome={biome} />
      <span className='coord-chip__label'>{value}</span>
    </span>
  )
}
