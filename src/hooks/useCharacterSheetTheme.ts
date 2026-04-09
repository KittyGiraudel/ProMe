'use client'

import { FormInstance } from 'antd'
import { useMemo } from 'react'
import { useAntPalette } from '@/components/AppProviders/ThemeProvider'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import {
  clampClockSliceIndex,
  countHalfClockSegments,
  isClockNightPhase,
} from '@/lib/character/clock'
import { useWatchedClock, useWatchedStamina } from './useCharacterSheetDerived'

export function useCharacterSheetTheme(form: FormInstance) {
  const { clock } = useWatchedClock(form)
  const { stamina } = useWatchedStamina(form)
  const { settings } = useSettings()
  const adaptiveAppearanceTheme = settings.sheet.adaptiveAppearanceTheme
  const clockSegmentsPerHalf = countHalfClockSegments(stamina.current)
  const clockPositionForPhase = clampClockSliceIndex(stamina.current, clock)
  const isClockNight = isClockNightPhase(
    clockPositionForPhase,
    clockSegmentsPerHalf
  )

  const appTheme = adaptiveAppearanceTheme
    ? isClockNight
      ? 'dark'
      : 'light'
    : settings.appearance.theme
  const antTheme = useAntPalette(appTheme)

  return useMemo(() => ({ appTheme, antTheme }), [appTheme, antTheme])
}
