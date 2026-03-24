import type { BiomeId, HexCoordinate } from '@/lib/character/types'
import { getMapCellHash } from '@/lib/map/hashTargets'
import { BiomeBubble } from '../BiomeBubble/BiomeBubble'
import './CoordChip.css'

export function CoordChip({
  biome,
  value,
  coord,
}: {
  biome: BiomeId | 'unexplored'
  value: string
  coord?: HexCoordinate
}) {
  const isInteractive = Boolean(coord)

  if (isInteractive && coord) {
    return (
      <a className='coord-chip coord-chip--link' href={getMapCellHash(coord)}>
        <BiomeBubble biome={biome} />
        <span className='coord-chip__label'>{value}</span>
      </a>
    )
  }

  return (
    <span className='coord-chip'>
      <BiomeBubble biome={biome} />
      <span className='coord-chip__label'>{value}</span>
    </span>
  )
}
