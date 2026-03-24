'use client'

import { theme as antdTheme } from 'antd'
import { computeClockSegmentsPerHalfFromStamina } from '@/lib/character/model'
import { useSettings } from '@/app/contexts/SettingsContext'

const CHARACTER_SHEET_NIGHT_THEME = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: '#5cb399',
    colorBgLayout: '#1a2420',
    colorBgContainer: '#243029',
    colorBgElevated: '#2d3b36',
    colorText: '#e8f0ed',
    colorTextSecondary: '#9eb5ac',
    colorBorder: '#3d4f47',
    colorBorderSecondary: '#3d4f47',
    borderRadius: 10,
    fontSize: 15,
    fontFamily:
      'var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  components: {
    Layout: {
      bodyBg: '#1a2420',
    },
  },
}

export function useCharacterSheetTheme({
  watchedClock,
  staminaCurrent,
  clockTotalSegments,
}: {
  watchedClock: number
  staminaCurrent: number
  clockTotalSegments: number
}) {
  const { settings } = useSettings()
  const adaptiveNightMode = settings.sheet.adaptiveNightMode
  const clockSegmentsPerHalf = computeClockSegmentsPerHalfFromStamina(
    staminaCurrent
  )
  const clockPositionForPhase = Math.min(
    Math.max(0, Math.trunc(watchedClock)),
    Math.max(0, clockTotalSegments - 1)
  )
  const isClockNight = clockPositionForPhase >= clockSegmentsPerHalf
  const characterSheetNightMode = isClockNight && adaptiveNightMode

  return {
    characterSheetNightMode,
    configTheme: characterSheetNightMode ? CHARACTER_SHEET_NIGHT_THEME : undefined,
  }
}
