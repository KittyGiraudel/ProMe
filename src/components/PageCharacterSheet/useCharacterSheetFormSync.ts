'use client'

import type { FormInstance } from 'antd'
import { useEffect, useRef } from 'react'
import {
  countClockSegments,
  remapClockPositionForTotalSegments,
} from '@/lib/character/clock'
import { Character } from '@/lib/character/types'
import { useWatchedClock, useWatchedStats } from './useCharacterSheetDerived'

export function useCharacterSheetFormSync({
  form,
  character,
}: {
  form: FormInstance
  character: Character | null
}) {
  const clock = useWatchedClock(form)
  const { health, courage, stamina } = useWatchedStats(form)
  const prevClockTotalSegmentsRef = useRef<number | null>(null)
  const clockTotalSegments = countClockSegments(stamina.current)

  useEffect(() => {
    // Skip during initial hydration: staminaCurrent is FALLBACK (0) while
    // character is null, which would produce a false clockTotalSegments change.
    if (!character) return

    const previous = prevClockTotalSegmentsRef.current

    if (previous === null) {
      prevClockTotalSegmentsRef.current = clockTotalSegments
      return
    }
    if (previous === clockTotalSegments) return

    const remapped = remapClockPositionForTotalSegments(
      clock,
      previous,
      clockTotalSegments
    )
    form.setFieldValue('clock', remapped)
    prevClockTotalSegmentsRef.current = clockTotalSegments
  }, [clockTotalSegments, clock, form, character])

  useEffect(() => {
    if (health.current == null || health.max == null) return
    if (health.current <= health.max) return
    form.setFieldValue(['health', 'current'], health.max)
  }, [health, form])

  useEffect(() => {
    if (courage.current == null || courage.max == null) return
    if (courage.current <= courage.max) return
    form.setFieldValue(['courage', 'current'], courage.max)
  }, [courage, form])

  useEffect(() => {
    if (stamina.current == null || stamina.max == null) return
    if (stamina.current <= stamina.max) return
    form.setFieldValue(['stamina', 'current'], stamina.max)
  }, [stamina, form])
}
