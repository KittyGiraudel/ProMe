'use client'

import { theme as antdTheme, ConfigProvider } from 'antd'
import { createContext, type ReactNode, useMemo } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { AppTheme } from '@/lib/settings/types'

const LIGHT_TOKENS = {
  token: {
    colorPrimary: '#2d6a4f',
    colorBgContainer: '#fff9ee',
    colorBgLayout: '#faf8f3',
    colorBgElevated: '#fff9ee',
    colorBorder: '#c4b49a',
    colorBorderSecondary: '#d4c5a9',
    colorLink: '#2d6a4f',
    colorLinkHover: '#3d8a64',
    colorLinkActive: '#1f4f38',
    borderRadius: 10,
    lineWidthFocus: 2,
    colorPrimaryBorder: '#3d8a64',
  },
  components: {
    Button: {
      borderRadius: 20,
      borderRadiusSM: 16,
      borderRadiusLG: 24,
    },
    Segmented: {
      trackBg: '#c8b89a',
      itemSelectedBg: '#fff9ee',
      itemSelectedColor: '#1f3a2a',
    },
  },
}

// Dark mode mirrors the same forest-green hue family as light mode,
// at medium darkness (~15–20% lightness) — comfortable in a dark room,
// not pitch black. Primary green is identical to light mode.
const DARK_TOKENS = {
  token: {
    colorPrimary: '#2d6a4f',
    colorBgContainer: '#243028',
    colorBgLayout: '#1a2420',
    colorBgElevated: '#2e3c32',
    colorBorder: '#3a4e44',
    colorBorderSecondary: '#2e4438',
    colorLink: '#6aaa88',
    colorLinkHover: '#8abfa8',
    colorLinkActive: '#4d9070',
    borderRadius: 10,
    lineWidthFocus: 2,
    colorPrimaryBorder: '#8abfa8',
  },
  components: {
    Button: {
      borderRadius: 20,
      borderRadiusSM: 16,
      borderRadiusLG: 24,
    },
    Segmented: {
      trackBg: '#2e4438',
      itemSelectedBg: '#243028',
      itemSelectedColor: '#c8ddd0',
    },
  },
}

export function useAntPalette(theme: AppTheme) {
  const isDark = theme === 'dark'
  const algorithm = isDark
    ? antdTheme.darkAlgorithm
    : antdTheme.defaultAlgorithm

  return useMemo(
    () => ({ algorithm, ...(isDark ? DARK_TOKENS : LIGHT_TOKENS) }),
    [algorithm, isDark]
  )
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const isDark = settings.appearance.theme === 'dark'
  const theme = useAntPalette(settings.appearance.theme)

  return (
    <ConfigProvider theme={{ zeroRuntime: true, ...theme }}>
      <AppearanceContext.Provider
        value={{ appTheme: isDark ? 'dark' : 'light' }}>
        {children}
      </AppearanceContext.Provider>
    </ConfigProvider>
  )
}

export const AppearanceContext = createContext<{
  appTheme: AppTheme
}>({
  appTheme: 'light',
})
