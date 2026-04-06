'use client'

import { theme as antdTheme, ConfigProvider } from 'antd'
import type { ReactNode } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { DARK_THEME_TOKENS, LIGHT_THEME_TOKENS } from '@/lib/theme/tokens'

const LIGHT_THEME = {
  token: LIGHT_THEME_TOKENS,
  components: {
    Layout: { bodyBg: LIGHT_THEME_TOKENS.colorBgLayout },
  },
}

const DARK_THEME = {
  algorithm: antdTheme.darkAlgorithm,
  token: DARK_THEME_TOKENS,
  components: {
    Layout: { bodyBg: DARK_THEME_TOKENS.colorBgLayout },
  },
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const theme = settings.appearance.theme === 'dark' ? DARK_THEME : LIGHT_THEME

  return <ConfigProvider theme={theme}>{children}</ConfigProvider>
}
