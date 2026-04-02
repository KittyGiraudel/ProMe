'use client'

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { DEFAULT_SETTINGS } from '@/lib/settings/model'
import { loadSettings, saveSettings } from '@/lib/settings/storage'
import type { AppSettings } from '@/lib/settings/types'

type SettingsContextValue = {
  settings: AppSettings
  updateSettings: (updater: (prev: AppSettings) => AppSettings) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)

  useEffect(function hydrateSettingsFromStorage() {
    void Promise.resolve().then(() => {
      setSettings(loadSettings())
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
      updateSettings,
    }),
    [settings, updateSettings]
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
