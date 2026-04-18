'use client'

import { useLayoutEffect, useRef } from 'react'
import type { CellCoordinate } from '@/lib/character/types'
import {
  formatDisplayedCellReference,
  fromCellKey,
  type SheetCoordinate,
  toCellKey,
} from '@/lib/map/coordinates'

function centerDescendantInScrollport(
  scroller: HTMLDivElement,
  target: HTMLElement,
  behavior: ScrollBehavior
) {
  const canScrollX = scroller.scrollWidth > scroller.clientWidth
  const canScrollY = scroller.scrollHeight > scroller.clientHeight
  if (!canScrollX && !canScrollY) return

  const sRect = scroller.getBoundingClientRect()
  const tRect = target.getBoundingClientRect()
  const deltaX = tRect.left + tRect.width / 2 - (sRect.left + sRect.width / 2)
  const deltaY = tRect.top + tRect.height / 2 - (sRect.top + sRect.height / 2)

  // Use `scrollBy` instead of `scrollIntoView` to avoid the page scrolling to
  // the map. This can be avoided with the `container` option, but it’s not wide
  // -ly supported yet.
  // See: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#browser_compatibility
  scroller.scrollBy({
    left: canScrollX ? deltaX : 0,
    top: canScrollY ? deltaY : 0,
    behavior,
  })
}

type UseMapScrollerAnchorArgs = {
  sheet: SheetCoordinate
  cell: CellCoordinate | null
}

/**
 * Ref for the map scrollport (`.MapScroller`). When `cell` is set and the sheet
 * changes or the anchor moves, the scrollport is scrolled so that cell is
 * centered (only if the scrollport actually overflows).
 */
export function useMapScrollerAnchor({
  sheet,
  cell,
}: UseMapScrollerAnchorArgs) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const anchorKey = cell ? toCellKey(cell) : ''

  useLayoutEffect(
    function scrollToAnchorCell() {
      if (!anchorKey) return

      const coord = fromCellKey(anchorKey)
      if (!coord) return

      const scroller = scrollerRef.current
      if (!scroller) return

      const id = formatDisplayedCellReference(coord)
      const target = document.getElementById(id)
      if (!target || !scroller.contains(target)) return

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
      const behavior = reduceMotion ? 'instant' : 'smooth'

      centerDescendantInScrollport(scroller, target, behavior)
    },
    [anchorKey, sheet]
  )

  return scrollerRef
}
