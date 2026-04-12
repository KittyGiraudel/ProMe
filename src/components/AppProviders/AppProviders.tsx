'use client'

import { App, ConfigProvider } from 'antd'
import localeEn from 'antd/locale/en_US'
import localeFr from 'antd/locale/fr_FR'
import type { ReactNode } from 'react'
import { NavigationBlockerProvider } from '@/components/AppProviders/NavigationBlockerContext'
import { ThemeProvider } from '@/components/AppProviders/ThemeProvider'
import { SettingsProvider } from '@/components/PageSettings/SettingsContext'
import { AuthProvider } from '@/lib/auth/context'

export function AppProviders({
  children,
  locale,
}: {
  children: ReactNode
  locale: 'fr' | 'en'
}) {
  return (
    <ConfigProvider locale={locale === 'fr' ? localeFr : localeEn}>
      <SettingsProvider>
        <AuthProvider>
          <ThemeProvider>
            <NavigationBlockerProvider>
              <App>{children}</App>
            </NavigationBlockerProvider>
          </ThemeProvider>
        </AuthProvider>
      </SettingsProvider>
    </ConfigProvider>
  )
}
