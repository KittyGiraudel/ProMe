import { Link } from '@/i18n/navigation'
import type { BiomeId, HexCoordinate } from '@/lib/character/types'
import { getDisplayedCellHash } from '@/lib/map/hashTargets'
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
  if (coord) {
    const fragment = getDisplayedCellHash(coord)
    return (
      <Link className='coord-chip coord-chip--link' href={'./map' + fragment}>
        <BiomeBubble biome={biome} />
        <span className='coord-chip__label'>{value}</span>
      </Link>
    )
  }

  return (
    <span className='coord-chip'>
      <BiomeBubble biome={biome} />
      <span className='coord-chip__label'>{value}</span>
    </span>
  )
}
