'use client'

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useWatchedMap } from '@/components/PageCharacterSheet/useCharacterSheetDerived'
import { normalizeMapState } from '@/lib/character/mapState'
import type { HexCoordinate } from '@/lib/character/types'
import { getSheetCoordinate, type SheetCoordinate } from '@/lib/hex/coordinates'

type UseMapSheetArgs = {
  currentPosition: HexCoordinate
  selectedCell: HexCoordinate | null
  setSelectedCell: Dispatch<SetStateAction<HexCoordinate | null>>
}

export function useMapSheet({ currentPosition }: UseMapSheetArgs) {
  const map = useWatchedMap()

  const [visibleSheet, setVisibleSheet] = useState<SheetCoordinate>(() =>
    getSheetCoordinate(currentPosition)
  )
  const hasSyncedVisibleSheetRef = useRef(false)
  const cardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (hasSyncedVisibleSheetRef.current) return
    if (map === undefined || map === null) return
    hasSyncedVisibleSheetRef.current = true
    const normalized = normalizeMapState(map)
    // Align visible sheet with persisted map once the form field hydrates.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from form watch
    setVisibleSheet(getSheetCoordinate(normalized.currentPosition))
  }, [map])

  const isViewingCurrentSheet = useMemo(() => {
    const sheetForCurrent = getSheetCoordinate(currentPosition)
    return (
      visibleSheet.sheetQ === sheetForCurrent.sheetQ &&
      visibleSheet.sheetR === sheetForCurrent.sheetR
    )
  }, [currentPosition, visibleSheet.sheetQ, visibleSheet.sheetR])

  return {
    visibleSheet,
    setVisibleSheet,
    cardRef,
    isViewingCurrentSheet,
  }
}
