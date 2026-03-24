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
  // preserve: true — pool fields live on other tabs; default useWatch only sees mounted fields.
  const watchOpts = { form, preserve: true } as const
  const watchedStaminaRaw = Form.useWatch('stamina', watchOpts) as
    | StatPool
    | undefined
  const watchedClockRaw = Form.useWatch('clock', watchOpts) as number | undefined
  const watchedHealthRaw = Form.useWatch('health', watchOpts) as StatPool | undefined
  const watchedCourageRaw = Form.useWatch('courage', watchOpts) as
    | StatPool
    | undefined

  const watchedStamina =
    watchedStaminaRaw ?? character?.stamina ?? FALLBACK_STAT_POOL
  const watchedClock = watchedClockRaw ?? character?.clock ?? 0
  const watchedHealth = watchedHealthRaw ?? character?.health ?? FALLBACK_STAT_POOL
  const watchedCourage =
    watchedCourageRaw ?? character?.courage ?? FALLBACK_STAT_POOL

  const clockTotalSegments = computeClockTotalSegmentsFromStamina(
    watchedStamina.current
  )

  return {
    watchedClock,
    watchedHealth,
    watchedCourage,
    watchedStamina,
    clockTotalSegments,
    healthCurrent: watchedHealth.current,
    healthMax: watchedHealth.max,
    courageCurrent: watchedCourage.current,
    courageMax: watchedCourage.max,
    staminaCurrent: watchedStamina.current,
    staminaMax: watchedStamina.max,
  }
}
