'use client'

import { App, ConfigProvider } from 'antd'
import antdLocale from 'antd/locale/fr_FR'
import type { ReactNode } from 'react'
import { NavigationBlockerProvider } from '@/app/[locale]/contexts/NavigationBlockerContext'
import { SettingsProvider } from '@/app/[locale]/contexts/SettingsContext'

const theme = {
  token: {
    colorPrimary: '#3d8b7a',
    colorBgLayout: '#f6f9f7',
    borderRadius: 10,
    fontSize: 15,
    fontFamily:
      'var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  components: {
    Layout: {
      bodyBg: '#f6f9f7',
    },
  },
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider locale={antdLocale} theme={theme}>
      <SettingsProvider>
        <NavigationBlockerProvider>
          <App>{children}</App>
        </NavigationBlockerProvider>
      </SettingsProvider>
    </ConfigProvider>
  )
}
