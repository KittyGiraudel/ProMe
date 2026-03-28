import { Link } from '@/i18n/navigation'
import type { BiomeId, HexCoordinate } from '@/lib/character/types'
import { getDisplayedCellHash } from '@/lib/map/hashTargets'
import { BiomeBubble } from '@/components/BiomeBubble/BiomeBubble'
import './CoordChip.css'

export function CoordChip({
  biome,
  value,
  coord,
  interactive = true,
}: {
  biome: BiomeId | 'unexplored'
  value: string
  coord?: HexCoordinate
  /** When false, never link to the map (e.g. journal preview inside a modal). */
  interactive?: boolean
}) {
  const inner = (
    <>
      <BiomeBubble biome={biome} />
      <span className='CoordChip__label'>{value}</span>
    </>
  )

  if (coord && interactive) {
    const fragment = getDisplayedCellHash(coord)
    return (
      <Link className='CoordChip' href={'./map' + fragment}>
        {inner}
      </Link>
    )
  }

  return <span className='CoordChip'>{inner}</span>
}
