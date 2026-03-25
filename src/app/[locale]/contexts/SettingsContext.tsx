'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_SETTINGS } from '@/lib/settings/model'
import { loadSettings, saveSettings } from '@/lib/settings/storage'
import type { AppSettings } from '@/lib/settings/types'

type SettingsContextValue = {
  settings: AppSettings
  hydrated: boolean
  updateSettings: (updater: (prev: AppSettings) => AppSettings) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    void Promise.resolve().then(() => {
      setSettings(loadSettings())
      setHydrated(true)
    })
  }, [])

  const updateSettings = useCallback(
    (updater: (prev: AppSettings) => AppSettings) => {
      setSettings(prev => {
        const next = updater(prev)
        saveSettings(next)
        return next
      })
    },
    []
  )

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      hydrated,
      updateSettings,
    }),
    [settings, hydrated, updateSettings]
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
