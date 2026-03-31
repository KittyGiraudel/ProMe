import { useCallback, useMemo } from 'react'
import {
  useWatchedJournal,
  useWatchedMap,
} from '@/components/PageCharacterSheet/useCharacterSheetDerived'
import { normalizeMapState } from '@/lib/character/mapState'
import { CharacterMapCell, HexCoordinate } from '@/lib/character/types'
import { formatDisplayedCellReference, toHexKey } from '@/lib/hex/coordinates'
import { buildCellReferenceToJournalEntriesIndex } from '@/lib/journal/cellReferenceIndex'

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

export const useMapState = () => {
  const map = useWatchedMap()
  const mapState = normalizeMapState(map)
  const cellsByKey = useMemo(() => {
    const next = new Map<string, CharacterMapCell>()
    for (const cell of mapState.cells) {
      next.set(toHexKey(cell), cell)
    }
    return next
  }, [mapState.cells])

  const getCellState = useCallback(
    (coord: HexCoordinate) => {
      const cell = cellsByKey.get(toHexKey(coord))
      const icon = cell?.icon ?? undefined
      const biome = cell?.biome

      return { icon, biome }
    },
    [cellsByKey]
  )

  return useMemo(
    () => ({
      mapState,
      cellsByKey,
      getCellState,
    }),
    [mapState, cellsByKey, getCellState]
  )
}
