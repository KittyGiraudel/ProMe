import { useCallback, useMemo } from 'react'
import {
  useWatchedJournal,
  useWatchedMap,
} from '@/components/PageCharacterSheet/useCharacterSheetDerived'
import { normalizeMapState } from '@/lib/character/mapState'
import { CharacterMapCell, HexCoordinate } from '@/lib/character/types'
import {
  formatDisplayedCellReference,
  getSheetCoordinate,
  SheetCoordinate,
  toHexKey,
} from '@/lib/hex/coordinates'
import { buildCellReferenceToJournalEntriesIndex } from '@/lib/journal/cellReferenceIndex'
import { BiomeId } from '@/lib/types'

export const useJournalIndex = () => {
  const journal = useWatchedJournal()
  const index = useMemo(
    () => buildCellReferenceToJournalEntriesIndex(journal),
    [journal]
  )

  const getLinksForCell = useCallback(
    (coord: HexCoordinate) => {
      const cellRef = formatDisplayedCellReference(coord)
      const journalLinks = index.get(cellRef) ?? []
      return journalLinks
    },
    [index]
  )

  return useMemo(() => ({ index, getLinksForCell }), [index, getLinksForCell])
}

export type CharacterCellData = {
  ref: string
  coord: HexCoordinate
  sheet: SheetCoordinate
  biome?: BiomeId
  icon?: string
}

export const useMapState = () => {
  const map = useWatchedMap()
  const mapState = normalizeMapState(map)
  const cellsByKey = useMemo(() => {
    const next = new Map<string, CharacterMapCell>()
    for (const cell of mapState.cells) next.set(toHexKey(cell), cell)
    return next
  }, [mapState.cells])

  const getCellState = useCallback(
    (coord: HexCoordinate): CharacterCellData => {
      const sheet = getSheetCoordinate(coord)
      const existing = cellsByKey.get(toHexKey(coord))
      const ref = formatDisplayedCellReference(coord)
      return {
        ref,
        coord,
        sheet,
        biome: existing?.biome,
        icon: existing?.icon,
      }
    },
    [cellsByKey]
  )

  return useMemo(() => ({ mapState, getCellState }), [mapState, getCellState])
}
