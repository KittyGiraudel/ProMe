'use client'

import {
  type Dispatch,
  type SetStateAction,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { HexCoordinate } from '@/lib/character/types'
import { getSheetCoordinate, type SheetCoordinate } from '@/lib/hex/coordinates'

type UseMapSheetArgs = {
  currentPosition: HexCoordinate
  selectedCell: HexCoordinate | null
  setSelectedCell: Dispatch<SetStateAction<HexCoordinate | null>>
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
