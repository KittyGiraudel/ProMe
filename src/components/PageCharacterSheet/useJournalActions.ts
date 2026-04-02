import { Dispatch, SetStateAction, useCallback } from 'react'
import { useSettings } from '../PageSettings/SettingsContext'

export const PAGE_SIZE = 5

export function useJournalActions({
  count,
  setCurrentPage,
  onAddEntry,
  onRemoveEntry,
}: {
  count: number
  setCurrentPage: Dispatch<SetStateAction<number>>
  onAddEntry: () => void
  onRemoveEntry: (index: number | number[]) => void
}) {
  const { settings } = useSettings()

  const addEntry = useCallback(() => {
    onAddEntry()
    if (settings.journal.timelineReverseChronological) {
      setCurrentPage(1)
    } else {
      const newTotalPages = Math.max(1, Math.ceil((count + 1) / PAGE_SIZE))
      setCurrentPage(newTotalPages)
    }
  }, [
    onAddEntry,
    settings.journal.timelineReverseChronological,
    setCurrentPage,
    count,
  ])

  const removeEntry = useCallback(
    (index: number | number[]) => {
      onRemoveEntry(index)
      const removedCount = Array.isArray(index) ? index.length : 1
      const newLength = count - removedCount
      const newTotalPages = Math.max(1, Math.ceil(newLength / PAGE_SIZE))
      setCurrentPage(prev => Math.min(prev, newTotalPages))
    },
    [onRemoveEntry, setCurrentPage, count]
  )

  return { addEntry, removeEntry }
}
