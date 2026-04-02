'use client'

import { BiomeBubble } from '@/components/BiomeBubble/BiomeBubble'
import { useCharacterLink } from '@/hooks/useCharacterLink'
import { Link } from '@/i18n/navigation'
import type { HexCoordinate } from '@/lib/character/types'
import { formatDisplayedCellReference } from '@/lib/hex/coordinates'
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
  coord?: HexCoordinate
  /** When false, never link to the map (e.g. journal preview inside a modal). */
  interactive?: boolean
}) {
  const getCharacterLink = useCharacterLink({ tabId: 'map' })
  const inner = (
    <>
      <BiomeBubble biome={biome} />
      <span className='CoordChip__label'>{value}</span>
    </>
  )

  if (coord && interactive) {
    return (
      <Link
        className='CoordChip'
        href={getCharacterLink({
          hash: formatDisplayedCellReference(coord),
        })}>
        {inner}
      </Link>
    )
  }

  return <span className='CoordChip'>{inner}</span>
}
