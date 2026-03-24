'use client'

import { Form } from 'antd'
import type { FormInstance } from 'antd'
import { computeClockTotalSegmentsFromStamina } from '@/lib/character/model'
import type { Character, StatPool } from '@/lib/character/types'

const FALLBACK_STAT_POOL: StatPool = { current: 0, max: 0 }

export function useCharacterSheetDerived({
  form,
  character,
}: {
  form: FormInstance
  character: Character | null
}) {
  // Watch only fields needed by derived UI and downstream hooks.
  const watchedStaminaRaw = Form.useWatch('stamina', form) as
    | StatPool
    | undefined
  const watchedClockRaw = Form.useWatch('clock', form) as number | undefined
  const watchedHealthRaw = Form.useWatch('health', form) as StatPool | undefined
  const watchedCourageRaw = Form.useWatch('courage', form) as
    | StatPool
    | undefined

  const watchedStamina =
    watchedStaminaRaw ?? character?.stamina ?? FALLBACK_STAT_POOL
  const watchedClock = watchedClockRaw ?? character?.clock ?? 0
  const watchedHealth = watchedHealthRaw ?? character?.health ?? FALLBACK_STAT_POOL
  const watchedCourage =
    watchedCourageRaw ?? character?.courage ?? FALLBACK_STAT_POOL

  const inventoryCap = Math.max(0, watchedStamina.current) * 6
  const inventoryLimit = Math.min(30, inventoryCap)
  const clockTotalSegments = computeClockTotalSegmentsFromStamina(
    watchedStamina.current
  )

  return {
    watchedClock,
    watchedHealth,
    watchedCourage,
    watchedStamina,
    inventoryLimit,
    clockTotalSegments,
    healthCurrent: watchedHealth.current,
    healthMax: watchedHealth.max,
    courageCurrent: watchedCourage.current,
    courageMax: watchedCourage.max,
    staminaCurrent: watchedStamina.current,
    staminaMax: watchedStamina.max,
  }
}
