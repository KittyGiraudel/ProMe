'use client'

import { theme as antdTheme, FormInstance } from 'antd'
import { useMemo } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import {
  clampClockSliceIndex,
  countHalfClockSegments,
  isClockNightPhase,
} from '@/lib/character/clock'
import { useWatchedClock, useWatchedStamina } from './useCharacterSheetDerived'

const CHARACTER_SHEET_NIGHT_THEME = {
  algorithm: antdTheme.darkAlgorithm,
}

const CHARACTER_SHEET_DAY_THEME = {
  algorithm: antdTheme.defaultAlgorithm,
}

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

  const algorithm =
    settings.appearance.theme === 'dark'
      ? antdTheme.darkAlgorithm
      : antdTheme.defaultAlgorithm

  return useMemo(
    () => ({
      appearance: adaptiveAppearanceTheme
        ? ((isClockNight ? 'dark' : 'light') as 'light' | 'dark')
        : settings.appearance.theme,
      theme: {
        algorithm: adaptiveAppearanceTheme
          ? isClockNight
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm
          : algorithm,
      },
    }),
    [isClockNight, settings.appearance.theme, algorithm]
  )
}
