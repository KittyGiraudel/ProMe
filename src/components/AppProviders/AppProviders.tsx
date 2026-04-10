'use client'

import { App, ConfigProvider } from 'antd'
import localeEn from 'antd/locale/en_US'
import localeFr from 'antd/locale/fr_FR'
import type { ReactNode } from 'react'
import { SerwistProvider } from '@/app/serwist'
import { NavigationBlockerProvider } from '@/components/AppProviders/NavigationBlockerContext'
import { ThemeProvider } from '@/components/AppProviders/ThemeProvider'
import { SettingsProvider } from '@/components/PageSettings/SettingsContext'

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
        <ThemeProvider>
          <NavigationBlockerProvider>
            <SerwistProvider swUrl='/serwist/sw.js'>
              <App>{children}</App>
            </SerwistProvider>
          </NavigationBlockerProvider>
        </ThemeProvider>
      </SettingsProvider>
    </ConfigProvider>
  )
}
