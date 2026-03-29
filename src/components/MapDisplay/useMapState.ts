import { normalizeMapState } from '@/lib/character/mapState'
import {
  CharacterMapCell,
  CharacterMapState,
  HexCoordinate,
  JournalEntry,
} from '@/lib/character/types'
import { formatDisplayedCellReference, toHexKey } from '@/lib/hex/coordinates'
import { buildCellReferenceToJournalEntriesIndex } from '@/lib/journal/cellReferenceIndex'
import { Form } from 'antd'
import { useCallback, useMemo } from 'react'

export const useJournalIndex = () => {
  const form = Form.useFormInstance()
  const watchedJournalEntries = Form.useWatch('journalEntries', {
    form,
    preserve: true,
  }) as JournalEntry[] | undefined
  const index = useMemo(
    () => buildCellReferenceToJournalEntriesIndex(watchedJournalEntries),
    [watchedJournalEntries]
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
  const form = Form.useFormInstance()
  const watchedMap = Form.useWatch('map', {
    form,
    preserve: true,
  }) as CharacterMapState | undefined

  const mapState = normalizeMapState(watchedMap)
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
