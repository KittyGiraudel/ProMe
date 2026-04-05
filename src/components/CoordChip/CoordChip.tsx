'use client'

import { BiomeBubble } from '@/components/BiomeBubble/BiomeBubble'
import { useCharacterLink } from '@/hooks/useCharacterLink'
import { Link } from '@/i18n/navigation'
import type { CellCoordinate } from '@/lib/character/types'
import { formatDisplayedCellReference } from '@/lib/map/coordinates'
import type { PossibleBiomeId } from '@/lib/types'

import './CoordChip.css'
import { useSettings } from '../PageSettings/SettingsContext'

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
  const { settings } = useSettings()
  const singlePageMode = settings.sheet.singlePageMode
  const getCharacterLink = useCharacterLink({ tabId: 'map' })
  const inner = (
    <>
      <BiomeBubble biome={biome} />
      <span className='CoordChip__label'>{value}</span>
    </>
  )

  if (coord && interactive) {
    const hash = formatDisplayedCellReference(coord)

    // For some reason, the `hashchange` event is not firing when using a `Link`
    // component. In the case of single page mode, we don’t need a full blown
    // link, we can just use an `a` tag with a hash.
    if (singlePageMode) {
      return (
        <a className='CoordChip' href={'#' + hash}>
          {inner}
        </a>
      )
    }

    return (
      <Link className='CoordChip' href={getCharacterLink({ hash })}>
        {inner}
      </Link>
    )
  }

  return <span className='CoordChip'>{inner}</span>
}
