import { normalizeMapState } from "@/lib/character/mapState"
import { CharacterMapCell, CharacterMapState, JournalEntry } from "@/lib/character/types"
import { toHexKey } from "@/lib/hex/coordinates"
import { buildCellReferenceToJournalEntriesIndex } from "@/lib/journal/cellReferenceIndex"
import { Form } from "antd"
import { useMemo } from "react"

const useJournalIndexByCell = () => {
  const form = Form.useFormInstance()
  const watchedJournalEntries = Form.useWatch('journalEntries', {
    form,
    preserve: true,
  }) as JournalEntry[] | undefined
  return  useMemo(
    () => buildCellReferenceToJournalEntriesIndex(watchedJournalEntries),
    [watchedJournalEntries]
  )
}

export const useMapState = () => {
  const journalIndexByCell = useJournalIndexByCell()
  
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

  return useMemo(() => ({
    mapState,
    cellsByKey,
    journalIndexByCell
  }), [
    mapState,
    cellsByKey,
    journalIndexByCell
  ])
}