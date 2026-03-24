'use client'

import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { HexCoordinate } from '@/lib/character/types'
import { getSheetCoordinate, isSameHex, type SheetCoordinate } from '@/lib/hex/coordinates'
import {
  getMapCellHash,
  getMapCellId,
  parseMapCellHash,
} from '@/lib/map/hashTargets'

/**
 * Keeps map selection/sheet state synchronized with location hash targets
 * like `#map-E13` or `#map-E13@1,-2`, and reveals the target cell once the
 * corresponding sheet is rendered.
 */
export function useMapHashNavigation({
  selectedCell,
  setSelectedCell,
  visibleSheet,
  setVisibleSheet,
  cardRef,
}: {
  selectedCell: HexCoordinate | null
  setSelectedCell: (coord: HexCoordinate) => void
  visibleSheet: SheetCoordinate
  setVisibleSheet: (sheet: SheetCoordinate) => void
  cardRef: RefObject<HTMLDivElement | null>
}) {
  const [hashSyncTick, setHashSyncTick] = useState(0)
  const lastHandledHashRef = useRef<string | null>(null)

  useEffect(() => {
    const onHashChange = () => setHashSyncTick(tick => tick + 1)
    window.addEventListener('hashchange', onHashChange)
    onHashChange()
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const target = parseMapCellHash(window.location.hash)
    if (!target) {
      lastHandledHashRef.current = null
      return
    }

    const normalizedHash = getMapCellHash(target)
    const targetSheet = getSheetCoordinate(target)
    const alreadySelected = selectedCell ? isSameHex(selectedCell, target) : false
    const alreadyVisible =
      visibleSheet.sheetQ === targetSheet.sheetQ &&
      visibleSheet.sheetR === targetSheet.sheetR

    if (!alreadySelected) setSelectedCell(target)
    if (!alreadyVisible) {
      setVisibleSheet(targetSheet)
      lastHandledHashRef.current = null
      return
    }

    if (lastHandledHashRef.current === normalizedHash) return

    const targetEl = document.getElementById(getMapCellId(target))
    if (!targetEl) return

    if (window.location.hash !== normalizedHash) {
      window.location.hash = normalizedHash
    }
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    cardRef.current?.focus({ preventScroll: true })
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    lastHandledHashRef.current = normalizedHash
  }, [cardRef, hashSyncTick, selectedCell, setSelectedCell, setVisibleSheet, visibleSheet])
}

