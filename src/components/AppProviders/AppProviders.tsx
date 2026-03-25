'use client'

import { App, ConfigProvider } from 'antd'
import antdLocale from 'antd/locale/fr_FR'
import type { ReactNode } from 'react'
import { NavigationBlockerProvider } from '@/app/contexts/NavigationBlockerContext'
import { LocalizationProvider } from '@/app/contexts/LocalizationContext'
import { SettingsProvider } from '@/app/contexts/SettingsContext'
import { defaultLocale, type Locale } from '@/messages/locales'
import { useEffect, useState } from 'react'

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

function antdLocaleFor(locale: Locale) {
  // For now, only French is supported.
  if (locale === 'fr') return antdLocale
  return antdLocale
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // Basic locale detection; only French exists today.
    const navLang = navigator.language?.toLowerCase() ?? ''
    void Promise.resolve().then(() => {
      if (navLang.startsWith('fr')) setLocale('fr')
    })
  }, [])

  return (
    <LocalizationProvider locale={locale}>
      <ConfigProvider locale={antdLocaleFor(locale)} theme={theme}>
        <SettingsProvider>
          <NavigationBlockerProvider>
            <App>{children}</App>
          </NavigationBlockerProvider>
        </SettingsProvider>
      </ConfigProvider>
    </LocalizationProvider>
  )
}
