'use client'

import { BiomeBubble } from '@/components/BiomeBubble/BiomeBubble'
import type { CellCoordinate } from '@/lib/character/types'
import { formatDisplayedCellReference } from '@/lib/map/coordinates'
import type { PossibleBiomeId } from '@/lib/types'

import './CoordChip.css'

export function CoordChip({
  biome,
  value,
  coord,
  interactive = true,
}: {
  biome: PossibleBiomeId
  value: string
  coord?: CellCoordinate
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
    const hash = formatDisplayedCellReference(coord)
    return (
      <a className='CoordChip' href={'#' + hash}>
        {inner}
      </a>
    )
  }

  return <span className='CoordChip'>{inner}</span>
}
