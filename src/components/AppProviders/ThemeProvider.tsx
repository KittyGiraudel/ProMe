'use client'

import { theme as antdTheme, ConfigProvider } from 'antd'
import { type ReactNode, useMemo } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const algorithm =
    settings.appearance.theme === 'dark'
      ? antdTheme.darkAlgorithm
      : antdTheme.defaultAlgorithm
  const theme = useMemo(() => ({ algorithm }), [algorithm])

  return <ConfigProvider theme={theme}>{children}</ConfigProvider>
}
