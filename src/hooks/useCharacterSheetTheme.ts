'use client'

import { theme as antdTheme, FormInstance } from 'antd'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import {
  clampClockSliceIndex,
  countHalfClockSegments,
  isClockNightPhase,
} from '@/lib/character/clock'
import { DARK_THEME_TOKENS, LIGHT_THEME_TOKENS } from '@/lib/theme/tokens'
import { useWatchedClock, useWatchedStamina } from './useCharacterSheetDerived'

const CHARACTER_SHEET_NIGHT_THEME = {
  algorithm: antdTheme.darkAlgorithm,
  token: DARK_THEME_TOKENS,
  components: {
    Layout: { bodyBg: DARK_THEME_TOKENS.colorBgLayout },
  },
}

const CHARACTER_SHEET_DAY_THEME = {
  algorithm: antdTheme.defaultAlgorithm,
  token: LIGHT_THEME_TOKENS,
  components: {
    Layout: { bodyBg: LIGHT_THEME_TOKENS.colorBgLayout },
  },
}

export function useCharacterSheetTheme({ form }: { form: FormInstance }) {
  const clock = useWatchedClock(form)
  const { stamina } = useWatchedStamina(form)

  const { settings } = useSettings()
  const adaptiveNightMode = settings.sheet.adaptiveNightMode
  const clockSegmentsPerHalf = countHalfClockSegments(stamina.current)
  const clockPositionForPhase = clampClockSliceIndex(stamina.current, clock)
  const isClockNight = isClockNightPhase(
    clockPositionForPhase,
    clockSegmentsPerHalf
  )
  const characterSheetNightMode = isClockNight && adaptiveNightMode

  let configTheme
  if (adaptiveNightMode) {
    configTheme = isClockNight
      ? CHARACTER_SHEET_NIGHT_THEME
      : CHARACTER_SHEET_DAY_THEME
  }

  return {
    characterSheetNightMode,
    configTheme,
  }
}
