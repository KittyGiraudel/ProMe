'use client'

import { useEffect, useRef } from 'react'
import type { FormInstance } from 'antd'
import {
  computeClockTotalSegmentsFromStamina,
  remapClockPositionForTotalSegments,
} from '@/lib/character/model'
import { Character } from '@/lib/character/types'
import { useCharacterSheetDerived } from './useCharacterSheetDerived'

export function useCharacterSheetFormSync({
  form,
  character,
}: {
  form: FormInstance
  character: Character | null,
}) {
  const {
    watchedClock,
    clockTotalSegments,
    healthCurrent,
    healthMax,
    courageCurrent,
    courageMax,
    staminaCurrent,
    staminaMax,
  } = useCharacterSheetDerived({ form, character })
  const prevClockTotalSegmentsRef = useRef<number | null>(null)

  useEffect(() => {
    const currentStamina = form.getFieldValue(['stamina', 'current']) as
      | number
      | undefined
    prevClockTotalSegmentsRef.current = computeClockTotalSegmentsFromStamina(
      currentStamina ?? 0
    )
  }, [form])

  useEffect(() => {
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
  }, [clockTotalSegments, watchedClock, form])

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
