'use client'

import { Form } from 'antd'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import {
  getSheetCoordinate,
  type SheetCoordinate,
} from '@/lib/hex/coordinates'
import type { CharacterMapState, HexCoordinate } from '@/lib/character/types'
import { normalizeMapState } from '@/lib/character/mapState'
import { useMapHashNavigation } from './useMapHashNavigation'

type UseMapCardSheetArgs = {
  currentPosition: HexCoordinate
  selectedCell: HexCoordinate | null
  setSelectedCell: Dispatch<SetStateAction<HexCoordinate | null>>
}

export function useMapCardSheet({
  currentPosition,
  selectedCell,
  setSelectedCell,
}: UseMapCardSheetArgs) {
  const form = Form.useFormInstance()
  const watchedMap = Form.useWatch('map', {
    form,
    preserve: true,
  }) as CharacterMapState | undefined

  const [visibleSheet, setVisibleSheet] = useState<SheetCoordinate>(() =>
    getSheetCoordinate(currentPosition)
  )
  const hasSyncedVisibleSheetRef = useRef(false)
  const cardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (hasSyncedVisibleSheetRef.current) return
    if (watchedMap === undefined || watchedMap === null) return
    hasSyncedVisibleSheetRef.current = true
    const normalized = normalizeMapState(watchedMap)
    // Align visible sheet with persisted map once the form field hydrates.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from form watch
    setVisibleSheet(getSheetCoordinate(normalized.currentPosition))
  }, [watchedMap])

  useMapHashNavigation({
    selectedCell,
    setSelectedCell: coord => setSelectedCell(coord),
    visibleSheet,
    setVisibleSheet,
    cardRef,
  })

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
