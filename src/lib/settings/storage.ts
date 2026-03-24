import { DEFAULT_SETTINGS, normalizeSettings } from './model'
import type { AppSettings } from './types'

const SETTINGS_STORAGE_KEY = 'lsdp:settings:v1'

function getLocalStorage(): Storage | null {
  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    return null
  }
  return globalThis.localStorage
}

export function loadSettings(): AppSettings {
  const storage = getLocalStorage()
  if (!storage) return DEFAULT_SETTINGS
  try {
    const raw = storage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return normalizeSettings(JSON.parse(raw))
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: AppSettings): void {
  const storage = getLocalStorage()
  if (!storage) return
  try {
    storage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(normalizeSettings(settings))
    )
  } catch {
    // Ignore persistence failures to keep UI responsive.
  }
}
