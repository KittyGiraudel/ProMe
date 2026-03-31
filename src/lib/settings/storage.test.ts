import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_SETTINGS } from './model'
import { loadSettings, saveSettings } from './storage'

const SETTINGS_STORAGE_KEY = 'prome:settings:v1'

describe('settings/storage', () => {
  const createMemoryStorage = (): Storage => {
    let map = new Map<string, string>()
    return {
      get length() {
        return map.size
      },
      clear() {
        map = new Map<string, string>()
      },
      getItem(key: string) {
        return map.has(key) ? map.get(key)! : null
      },
      key(index: number) {
        return Array.from(map.keys())[index] ?? null
      },
      removeItem(key: string) {
        map.delete(key)
      },
      setItem(key: string, value: string) {
        map.set(key, value)
      },
    }
  }

  beforeEach(() => {
    vi.stubGlobal('localStorage', createMemoryStorage())
  })

  it('returns defaults when no settings are persisted', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })

  it('persists and reloads normalized settings', () => {
    saveSettings({
      ...DEFAULT_SETTINGS,
      sheet: { adaptiveNightMode: true, singlePageMode: true },
      journal: { timelineReverseChronological: true },
    })

    const loaded = loadSettings()
    expect(loaded.sheet.adaptiveNightMode).toBe(true)
    expect(loaded.journal.timelineReverseChronological).toBe(true)
  })

  it('falls back to defaults on malformed JSON', () => {
    globalThis.localStorage.setItem(SETTINGS_STORAGE_KEY, '{not-json')
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
  })
})
