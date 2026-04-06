'use client'

import { App, ConfigProvider } from 'antd'
import antdLocale from 'antd/locale/fr_FR'
import type { ReactNode } from 'react'
import { NavigationBlockerProvider } from '@/components/AppProviders/NavigationBlockerContext'
import { ThemeProvider } from '@/components/AppProviders/ThemeProvider'
import { SettingsProvider } from '@/components/PageSettings/SettingsContext'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider locale={antdLocale}>
      <SettingsProvider>
        <ThemeProvider>
          <NavigationBlockerProvider>
            <App>{children}</App>
          </NavigationBlockerProvider>
        </ThemeProvider>
      </SettingsProvider>
    </ConfigProvider>
  )
}
