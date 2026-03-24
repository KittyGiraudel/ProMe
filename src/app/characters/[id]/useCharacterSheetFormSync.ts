'use client'

import { useEffect, useRef } from 'react'
import type { FormInstance } from 'antd'
import {
  computeClockTotalSegmentsFromStamina,
  remapClockPositionForTotalSegments,
} from '@/lib/character/model'

export function useCharacterSheetFormSync({
  form,
  sheetCharacterId,
  watchedClock,
  clockTotalSegments,
  healthCurrent,
  healthMax,
  courageCurrent,
  courageMax,
  staminaCurrent,
  staminaMax,
}: {
  form: FormInstance
  sheetCharacterId: string | undefined
  watchedClock: number
  clockTotalSegments: number
  healthCurrent: number | undefined
  healthMax: number | undefined
  courageCurrent: number | undefined
  courageMax: number | undefined
  staminaCurrent: number | undefined
  staminaMax: number | undefined
}) {
  const prevClockTotalSegmentsRef = useRef<number | null>(null)

  useEffect(() => {
    if (!sheetCharacterId) return
    const currentStamina = form.getFieldValue(['stamina', 'current']) as
      | number
      | undefined
    prevClockTotalSegmentsRef.current = computeClockTotalSegmentsFromStamina(
      currentStamina ?? 0
    )
  }, [sheetCharacterId, form])

  useEffect(() => {
    if (!sheetCharacterId) return
    const previous = prevClockTotalSegmentsRef.current
    if (previous === null) {
      prevClockTotalSegmentsRef.current = clockTotalSegments
      return
    }
    if (previous === clockTotalSegments) return
    const remapped = remapClockPositionForTotalSegments(
      watchedClock,
      previous,
      clockTotalSegments
    )
    form.setFieldValue('clock', remapped)
    prevClockTotalSegmentsRef.current = clockTotalSegments
  }, [sheetCharacterId, clockTotalSegments, watchedClock, form])

  useEffect(() => {
    if (healthCurrent == null || healthMax == null) return
    if (healthCurrent <= healthMax) return
    form.setFieldValue(['health', 'current'], healthMax)
  }, [healthCurrent, healthMax, form])

  useEffect(() => {
    if (courageCurrent == null || courageMax == null) return
    if (courageCurrent <= courageMax) return
    form.setFieldValue(['courage', 'current'], courageMax)
  }, [courageCurrent, courageMax, form])

  useEffect(() => {
    if (staminaCurrent == null || staminaMax == null) return
    if (staminaCurrent <= staminaMax) return
    form.setFieldValue(['stamina', 'current'], staminaMax)
  }, [staminaCurrent, staminaMax, form])
}
