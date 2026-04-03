'use client'

import type { FormInstance } from 'antd'
import { useEffect, useRef } from 'react'
import {
  countClockSegments,
  remapClockPositionForTotalSegments,
} from '@/lib/character/clock'
import { Character } from '@/lib/character/types'
import { useWatchedClock, useWatchedStamina } from './useCharacterSheetDerived'

export function useCharacterSheetFormSync({
  form,
  character,
}: {
  form: FormInstance
  character: Character | null
}) {
  const { clock, updateClock } = useWatchedClock(form)
  const { stamina } = useWatchedStamina(form)
  const prevClockTotalSegmentsRef = useRef<number | null>(null)
  const clockTotalSegments = countClockSegments(stamina.current)

  useEffect(
    function capClockToStamina() {
      // Skip during initial hydration: staminaCurrent is FALLBACK (0) while
      // character is null, which would produce a false clockTotalSegments change.
      if (!character) return

      const previous = prevClockTotalSegmentsRef.current

      if (previous === clockTotalSegments) return
      if (previous === null) {
        // Seed from the character's real stamina, not from the transient fallback
        // value that Form.useWatch returns before its subscription fires. Without
        // this, clockTotalSegments starts as 2 (stamina=0 → 2 segments via
        // FALLBACK_STAT_POOL), then updates to the real value, causing a spurious
        // setFieldValue call — which marks the clock field as touched in Ant
        // Design 6 and falsely triggers the unsaved-changes guard.
        prevClockTotalSegmentsRef.current = character
          ? countClockSegments(character.stamina.current)
          : clockTotalSegments
        return
      }

      const remapped = remapClockPositionForTotalSegments(
        clock,
        previous,
        clockTotalSegments
      )
      updateClock(remapped)
      prevClockTotalSegmentsRef.current = clockTotalSegments
    },
    [clockTotalSegments, clock, updateClock, character]
  )
}
