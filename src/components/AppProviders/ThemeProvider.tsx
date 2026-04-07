'use client'

import { theme as antdTheme, ConfigProvider } from 'antd'
import { type ReactNode, useMemo } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'

const LIGHT_TOKENS = {
  token: {
    colorPrimary: '#2d6a4f',
    colorBgContainer: '#fff9ee',
    colorBgLayout: '#faf8f3',
    colorBgElevated: '#fff9ee',
    colorBorder: '#e2d9c4',
    borderRadius: 10,
  },
  components: {
    Button: {
      borderRadius: 20,
      borderRadiusSM: 16,
      borderRadiusLG: 24,
    },
  },
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const isDark = settings.appearance.theme === 'dark'
  const algorithm = isDark
    ? antdTheme.darkAlgorithm
    : antdTheme.defaultAlgorithm

  const theme = useMemo(
    () => ({
      algorithm,
      ...(isDark ? {} : LIGHT_TOKENS),
    }),
    [algorithm, isDark]
  )

  return <ConfigProvider theme={theme}>{children}</ConfigProvider>
}
