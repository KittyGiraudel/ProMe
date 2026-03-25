'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'
import type { Locale } from '@/messages/locales'
import { defaultLocale, getMessages } from '@/messages/locales'
import { createLocalize, type Localize } from '@/lib/localization/localize'

type LocalizationContextValue = {
  locale: Locale
  localize: Localize
}

const LocalizationContext = createContext<LocalizationContextValue | null>(null)

export function LocalizationProvider({
  locale = defaultLocale,
  children,
}: {
  locale?: Locale
  children: ReactNode
}) {
  const copy = useMemo(() => getMessages(locale), [locale])
  const localize = useMemo(
    () => createLocalize({ locale, copy }),
    [locale, copy]
  )

  const value = useMemo<LocalizationContextValue>(
    () => ({
      locale,
      localize,
    }),
    [locale, localize]
  )

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  )
}

export function useLocalization(): LocalizationContextValue {
  const ctx = useContext(LocalizationContext)
  if (!ctx) {
    throw new Error('useLocalization must be used within LocalizationProvider')
  }
  return ctx
}

export function useLocalize(): Localize {
  return useLocalization().localize
}
