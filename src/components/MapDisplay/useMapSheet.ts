'use client'

import {
  type Dispatch,
  type SetStateAction,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { CellCoordinate } from '@/lib/character/types'
import { getSheetCoordinate, type SheetCoordinate } from '@/lib/map/coordinates'

type UseMapSheetArgs = {
  currentPosition: CellCoordinate
  selectedCell: CellCoordinate | null
  setSelectedCell: Dispatch<SetStateAction<CellCoordinate | null>>
}

export function useMapSheet({ currentPosition }: UseMapSheetArgs) {
  const [visibleSheet, setVisibleSheet] = useState<SheetCoordinate>(() =>
    getSheetCoordinate(currentPosition)
  )
  const cardRef = useRef<HTMLDivElement | null>(null)
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
