# Biome Audio Player Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Play biome-reactive ambient music on the character sheet, with fade transitions between biomes, Cache API preloading, a compact play/pause/volume widget, and a sound settings section.

**Architecture:** A `useAudioPlayer` hook manages an `HTMLAudioElement` + Web Audio API gain node for fade-out transitions, plus Cache API preloading when sound is first enabled. An `AudioPlayer` component renders the widget and is mounted at the bottom of `CharacterSheetShell` (a Next.js layout — it persists across tab navigation). Settings gain a `sound` section with `enabled` (boolean) and `variant` ('mix' | 'music' | 'ambiance').

**Tech Stack:** Web Audio API, Cache API, Ant Design (Button, Slider, Space, notification), next-intl, Vitest

---

## File Structure

**New files:**
- `src/lib/sounds/catalog.ts` — `BiomeId` → track entries; `getTrackPath`, `getAllTrackPaths`, `getTracksForBiome`, `pickRandomTrack`
- `src/lib/sounds/catalog.test.ts` — unit tests for path resolution and variant fallback
- `src/hooks/useAudioPlayer.ts` — audio state machine: biome transitions, fade-out via gain node, Cache API preloading
- `src/components/AudioPlayer/AudioPlayer.tsx` — play/pause, volume slider, preloading state, error state
- `src/components/AudioPlayer/AudioPlayer.css` — styles (PascalCase BEM)

**Modified files:**
- `src/lib/settings/types.ts` — add `sound: { enabled: boolean; variant: SoundVariant }` section
- `src/lib/settings/model.ts` — add sound defaults + normalization
- `src/lib/settings/model.test.ts` — add sound normalization tests
- `src/components/CharacterSheetShell/CharacterSheetShell.tsx` — mount `<AudioPlayer biome={bannerBiome} />`
- `src/components/PageSettings/Settings.tsx` — add sound settings section (enable toggle + variant selector + data warning)
- `src/hooks/useKeyboardShortcuts.tsx` — add Cmd+M to toggle `sound.enabled`
- `messages/en.json` — add `settings.section_sound`, `settings.sound_*`, and `audio_player.*` keys
- `messages/fr.json` — French equivalents

---

## Task 1: Sound catalog

**Files:**
- Create: `src/lib/sounds/catalog.ts`
- Create: `src/lib/sounds/catalog.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/sounds/catalog.test.ts`:

```typescript
import { describe, expect, it } from 'vitest'
import type { BiomeId } from '@/lib/types'
import {
  getAllTrackPaths,
  getTrackPath,
  getTracksForBiome,
} from './catalog'

describe('sounds/catalog', () => {
  describe('getTrackPath', () => {
    it('returns mix path for mix variant', () => {
      expect(
        getTrackPath(
          { file: '344_Yokai_Forest', name: 'Yōkai Forest', hasMusic: true, hasAmbiance: true },
          'mix'
        )
      ).toBe('/musics/344_Yokai_Forest.mp3')
    })

    it('returns music-only path when track has music variant', () => {
      expect(
        getTrackPath(
          { file: '344_Yokai_Forest', name: 'Yōkai Forest', hasMusic: true, hasAmbiance: true },
          'music'
        )
      ).toBe('/musics/344_Yokai_Forest_MUS_Only.mp3')
    })

    it('falls back to mix when track has no music variant', () => {
      expect(
        getTrackPath(
          { file: '96_Windswept_Plains', name: 'Windswept Plains', hasMusic: false, hasAmbiance: false },
          'music'
        )
      ).toBe('/musics/96_Windswept_Plains.mp3')
    })

    it('returns ambiance-only path when track has ambiance variant', () => {
      expect(
        getTrackPath(
          { file: '138_Desert_Winds', name: 'Desert Winds', hasMusic: false, hasAmbiance: true },
          'ambiance'
        )
      ).toBe('/musics/138_Desert_Winds_AMB_Only.mp3')
    })

    it('falls back to mix when track has no ambiance variant', () => {
      expect(
        getTrackPath(
          { file: '96_Windswept_Plains', name: 'Windswept Plains', hasMusic: false, hasAmbiance: false },
          'ambiance'
        )
      ).toBe('/musics/96_Windswept_Plains.mp3')
    })
  })

  describe('getTracksForBiome', () => {
    it('returns 2 tracks for every biome', () => {
      const biomes: BiomeId[] = [
        'shadowForest',
        'floodedPlains',
        'mushroomJungle',
        'fieldSea',
        'silentDesert',
        'giganticGardens',
      ]
      for (const biome of biomes) {
        expect(getTracksForBiome(biome)).toHaveLength(2)
      }
    })

    it('fieldSea first track has no variants', () => {
      const [track] = getTracksForBiome('fieldSea')
      expect(track.file).toBe('96_Windswept_Plains')
      expect(track.hasMusic).toBe(false)
      expect(track.hasAmbiance).toBe(false)
    })

    it('silentDesert first track has ambiance-only variant but no music', () => {
      const [track] = getTracksForBiome('silentDesert')
      expect(track.file).toBe('138_Desert_Winds')
      expect(track.hasMusic).toBe(false)
      expect(track.hasAmbiance).toBe(true)
    })
  })

  describe('getAllTrackPaths', () => {
    it('returns 12 paths for any variant (2 tracks × 6 biomes)', () => {
      expect(getAllTrackPaths('mix')).toHaveLength(12)
      expect(getAllTrackPaths('music')).toHaveLength(12)
      expect(getAllTrackPaths('ambiance')).toHaveLength(12)
    })

    it('uses MUS_Only suffix for music variant when available', () => {
      expect(getAllTrackPaths('music')).toContain(
        '/musics/344_Yokai_Forest_MUS_Only.mp3'
      )
    })

    it('falls back to mix path when music variant is unavailable', () => {
      expect(getAllTrackPaths('music')).toContain(
        '/musics/96_Windswept_Plains.mp3'
      )
    })

    it('uses AMB_Only suffix for ambiance variant when available', () => {
      expect(getAllTrackPaths('ambiance')).toContain(
        '/musics/138_Desert_Winds_AMB_Only.mp3'
      )
    })
  })
})
```

- [ ] **Step 2: Run to confirm tests fail**

```
npx vitest run src/lib/sounds/catalog.test.ts
```

Expected: error — module not found.

- [ ] **Step 3: Implement the catalog**

Create `src/lib/sounds/catalog.ts`:

```typescript
import type { BiomeId } from '@/lib/types'

export type SoundVariant = 'mix' | 'music' | 'ambiance'

export type TrackEntry = {
  file: string
  name: string
  hasMusic: boolean
  hasAmbiance: boolean
}

type BiomeSoundConfig = {
  tracks: [TrackEntry, TrackEntry]
}

const BIOME_SOUNDS: Record<BiomeId, BiomeSoundConfig> = {
  shadowForest: {
    tracks: [
      { file: '344_Yokai_Forest', name: 'Yōkai Forest', hasMusic: true, hasAmbiance: true },
      { file: '313_Dusk_of_the_Dryad', name: 'Dusk of the Dryad', hasMusic: true, hasAmbiance: true },
    ],
  },
  floodedPlains: {
    tracks: [
      { file: '353_Spirit_of_the_Plains', name: 'Spirit of the Plains', hasMusic: true, hasAmbiance: true },
      { file: '234_Lush_World', name: 'Lush World', hasMusic: true, hasAmbiance: true },
    ],
  },
  mushroomJungle: {
    tracks: [
      { file: '228_Mushroom_Forest', name: 'Mushroom Forest', hasMusic: true, hasAmbiance: true },
      { file: '332_Myconid_Colony', name: 'Myconid Colony', hasMusic: true, hasAmbiance: true },
    ],
  },
  fieldSea: {
    tracks: [
      { file: '96_Windswept_Plains', name: 'Windswept Plains', hasMusic: false, hasAmbiance: false },
      { file: '305_Hidden_Valley', name: 'Hidden Valley', hasMusic: true, hasAmbiance: true },
    ],
  },
  silentDesert: {
    tracks: [
      { file: '138_Desert_Winds', name: 'Desert Winds', hasMusic: false, hasAmbiance: true },
      { file: '361_Ancient_Beacon', name: 'Ancient Beacon', hasMusic: true, hasAmbiance: true },
    ],
  },
  giganticGardens: {
    tracks: [
      { file: '423_Magical_Flora', name: 'Magical Flora', hasMusic: true, hasAmbiance: true },
      { file: '275_Lorekeeper_Grove', name: 'Lorekeeper Grove', hasMusic: true, hasAmbiance: true },
    ],
  },
}

export function getTrackPath(track: TrackEntry, variant: SoundVariant): string {
  const base = `/musics/${track.file}`
  if (variant === 'music' && track.hasMusic) return `${base}_MUS_Only.mp3`
  if (variant === 'ambiance' && track.hasAmbiance) return `${base}_AMB_Only.mp3`
  return `${base}.mp3`
}

export function getTracksForBiome(biome: BiomeId): [TrackEntry, TrackEntry] {
  return BIOME_SOUNDS[biome].tracks
}

export function getAllTrackPaths(variant: SoundVariant): string[] {
  return (Object.values(BIOME_SOUNDS) as BiomeSoundConfig[]).flatMap(config =>
    config.tracks.map(track => getTrackPath(track, variant))
  )
}

export function pickRandomTrack(biome: BiomeId): TrackEntry {
  const [a, b] = BIOME_SOUNDS[biome].tracks
  return Math.random() < 0.5 ? a : b
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```
npx vitest run src/lib/sounds/catalog.test.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/sounds/catalog.ts src/lib/sounds/catalog.test.ts
git commit -m "feat: add biome sound catalog with track entries and variant path resolution"
```

---

## Task 2: Settings — add sound section

**Files:**
- Modify: `src/lib/settings/types.ts`
- Modify: `src/lib/settings/model.ts`
- Modify: `src/lib/settings/model.test.ts`

- [ ] **Step 1: Write failing tests**

Add to `src/lib/settings/model.test.ts` (append inside the `describe` block):

```typescript
  it('defaults sound to disabled with mix variant', () => {
    expect(normalizeSettings(undefined).sound).toEqual({
      enabled: false,
      variant: 'mix',
    })
  })

  it('keeps sound.enabled when true', () => {
    expect(
      normalizeSettings({ sound: { enabled: true } }).sound.enabled
    ).toBe(true)
  })

  it('keeps sound.variant when valid', () => {
    expect(
      normalizeSettings({ sound: { variant: 'music' } }).sound.variant
    ).toBe('music')

    expect(
      normalizeSettings({ sound: { variant: 'ambiance' } }).sound.variant
    ).toBe('ambiance')
  })

  it('defaults invalid sound.variant to mix', () => {
    expect(
      normalizeSettings({ sound: { variant: 'invalid' } }).sound.variant
    ).toBe('mix')
  })
```

- [ ] **Step 2: Run to confirm tests fail**

```
npx vitest run src/lib/settings/model.test.ts
```

Expected: FAIL — `normalizeSettings(undefined).sound` is `undefined`.

- [ ] **Step 3: Update types**

In `src/lib/settings/types.ts`, add the import and the `sound` field. Full new file:

```typescript
import type { SoundVariant } from '@/lib/sounds/catalog'

export const SETTINGS_SCHEMA_VERSION = 1 as const

export type AppSettings = {
  schemaVersion: typeof SETTINGS_SCHEMA_VERSION
  sheet: {
    adaptiveNightMode: boolean
    /** When true, the character sheet is rendered as a single scrollable page instead of tabs. */
    singlePageMode: boolean
  }
  journal: {
    /** When true, journal timeline is reverse chronological (newest first). */
    timelineReverseChronological: boolean
  }
  village: {
    /**
     * When true, duplicate establishment rows are merged in the village generator
     * summary and in journal link labels for village URLs.
     */
    mergeDuplicateEstablishments: boolean
  }
  map: {
    /** When true, moving to an adjacent cell on the character map advances the clock one slice. */
    tickClockOnMove: boolean
    /** When true, biome background patterns are rendered inside each cell. */
    showBiomeBackground: boolean
    /** Controls how cell coordinates are displayed: on the axes, inside cells, or both. */
    coordinatesDisplay: 'axes' | 'cells' | 'both'
  }
  sound: {
    /** When true, ambient music plays based on the current biome. Defaults to false. */
    enabled: boolean
    /** Which variant of the soundtrack to play. Defaults to 'mix'. */
    variant: SoundVariant
  }
}
```

- [ ] **Step 4: Update model**

In `src/lib/settings/model.ts`, add the sound section. Full new file:

```typescript
import { type AppSettings, SETTINGS_SCHEMA_VERSION } from './types'

export const DEFAULT_SETTINGS: AppSettings = {
  schemaVersion: SETTINGS_SCHEMA_VERSION,
  sheet: {
    adaptiveNightMode: false,
    singlePageMode: true,
  },
  journal: {
    timelineReverseChronological: false,
  },
  village: {
    mergeDuplicateEstablishments: false,
  },
  map: {
    tickClockOnMove: false,
    showBiomeBackground: true,
    coordinatesDisplay: 'both',
  },
  sound: {
    enabled: false,
    variant: 'mix',
  },
}

export function normalizeSettings(value: unknown): AppSettings {
  const source = value as Partial<AppSettings> | undefined
  return {
    schemaVersion: SETTINGS_SCHEMA_VERSION,
    sheet: {
      adaptiveNightMode: source?.sheet?.adaptiveNightMode === true,
      singlePageMode: source?.sheet?.singlePageMode !== false,
    },
    journal: {
      timelineReverseChronological:
        source?.journal?.timelineReverseChronological === true,
    },
    village: {
      mergeDuplicateEstablishments:
        source?.village?.mergeDuplicateEstablishments === true,
    },
    map: {
      tickClockOnMove: source?.map?.tickClockOnMove === true,
      showBiomeBackground: source?.map?.showBiomeBackground !== false,
      coordinatesDisplay: (['axes', 'cells', 'both'] as const).includes(
        source?.map?.coordinatesDisplay as 'axes' | 'cells' | 'both'
      )
        ? (source!.map!.coordinatesDisplay as 'axes' | 'cells' | 'both')
        : 'both',
    },
    sound: {
      enabled: source?.sound?.enabled === true,
      variant: (['mix', 'music', 'ambiance'] as const).includes(
        source?.sound?.variant as 'mix' | 'music' | 'ambiance'
      )
        ? (source!.sound!.variant as 'mix' | 'music' | 'ambiance')
        : 'mix',
    },
  }
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```
npx vitest run src/lib/settings/model.test.ts
```

Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/settings/types.ts src/lib/settings/model.ts src/lib/settings/model.test.ts
git commit -m "feat: add sound settings (enabled + variant) to AppSettings"
```

---

## Task 3: Translation keys

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/fr.json`

No tests for i18n files — correctness is verified at compile time by TypeScript.

- [ ] **Step 1: Add English keys**

In `messages/en.json`, inside the `"settings"` object (after the `"section_village"` line), add:

```json
    "section_sound": "Sound",
    "sound_enabled_label": "Background music",
    "sound_enabled_help": "Plays ambient music matching the current biome. Enabling this will preload approximately 180 MB of audio files the first time.",
    "sound_variant_label": "Soundtrack variant",
    "sound_variant_help": "Choose between full soundtracks (music + ambiance), music-only, or ambiance-only. Changing this variant will reload the relevant files.",
    "sound_variant_mix": "Full soundtrack",
    "sound_variant_music": "Music only",
    "sound_variant_ambiance": "Ambiance only",
```

Also in `messages/en.json`, add a new top-level `"audio_player"` key before the closing `}` of the file (alongside other top-level keys like `"settings"`, `"village"`, etc.):

```json
  "audio_player": {
    "preloading": "Preloading soundtracks…",
    "preload_complete": "Music is ready to play.",
    "play": "Play",
    "pause": "Pause",
    "volume": "Volume",
    "error": "Failed to load audio.",
    "retry": "Retry"
  },
```

- [ ] **Step 2: Add French keys**

In `messages/fr.json`, inside the `"settings"` object (after the `"section_village"` line), add:

```json
    "section_sound": "Son",
    "sound_enabled_label": "Musique d'ambiance",
    "sound_enabled_help": "Joue une musique d'ambiance correspondant au biome actuel. L'activer téléchargera environ 180 Mo de fichiers audio la première fois.",
    "sound_variant_label": "Variante de la bande son",
    "sound_variant_help": "Choisissez entre la bande son complète (musique + ambiance), musique seule ou ambiance seule. Changer la variante rechargera les fichiers concernés.",
    "sound_variant_mix": "Bande son complète",
    "sound_variant_music": "Musique seule",
    "sound_variant_ambiance": "Ambiance seule",
```

In `messages/fr.json`, add a new top-level `"audio_player"` key:

```json
  "audio_player": {
    "preloading": "Préchargement des bandes sons…",
    "preload_complete": "La musique est prête à jouer.",
    "play": "Lire",
    "pause": "Pause",
    "volume": "Volume",
    "error": "Impossible de charger l'audio.",
    "retry": "Réessayer"
  },
```

- [ ] **Step 3: Verify the build still compiles**

```
npm run build 2>&1 | tail -20
```

Expected: no TypeScript errors. (The new keys are used in later tasks — don't worry about "unused" warnings here.)

- [ ] **Step 4: Commit**

```bash
git add messages/en.json messages/fr.json
git commit -m "feat: add sound and audio player i18n keys"
```

---

## Task 4: `useAudioPlayer` hook

**Files:**
- Create: `src/hooks/useAudioPlayer.ts`

This hook cannot be meaningfully unit-tested with Vitest because it depends on browser APIs (`AudioContext`, `HTMLAudioElement`, `caches`). Manual testing will be done in Task 7. No test file for this task.

- [ ] **Step 1: Implement the hook**

Create `src/hooks/useAudioPlayer.ts`:

```typescript
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getAllTrackPaths,
  getTrackPath,
  pickRandomTrack,
  type SoundVariant,
} from '@/lib/sounds/catalog'
import type { BiomeId } from '@/lib/types'

export type AudioPlayerState = {
  isPlaying: boolean
  volume: number
  setVolume: (v: number) => void
  togglePlay: () => void
  isPreloading: boolean
  preloadError: string | null
}

const FADE_DURATION_MS = 2000
const CACHE_NAME = 'prome-sounds-v1'

export function useAudioPlayer({
  biome,
  enabled,
  variant,
}: {
  biome: BiomeId | 'unexplored'
  enabled: boolean
  variant: SoundVariant
}): AudioPlayerState {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const currentBiomeRef = useRef<BiomeId | null>(null)
  const volumeRef = useRef(0.8)
  const isFadingRef = useRef(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.8)
  const [isPreloading, setIsPreloading] = useState(false)
  const [preloadError, setPreloadError] = useState<string | null>(null)

  // Create HTMLAudioElement once on mount.
  useEffect(() => {
    const audio = new Audio()
    audio.loop = true
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  // Lazily initialize Web Audio API (must happen after user gesture; the settings
  // toggle counts). Connects audio element → gain node → destination.
  function getAudioContext(): AudioContext {
    if (!audioContextRef.current) {
      const ctx = new AudioContext()
      const gainNode = ctx.createGain()
      gainNodeRef.current = gainNode
      if (audioRef.current) {
        const source = ctx.createMediaElementSource(audioRef.current)
        source.connect(gainNode)
        gainNode.connect(ctx.destination)
      }
      audioContextRef.current = ctx
    }
    if (audioContextRef.current.state === 'suspended') {
      void audioContextRef.current.resume()
    }
    return audioContextRef.current
  }

  function fadeOut(): Promise<void> {
    return new Promise(resolve => {
      const ctx = audioContextRef.current
      const gain = gainNodeRef.current
      if (!ctx || !gain) {
        resolve()
        return
      }
      isFadingRef.current = true
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + FADE_DURATION_MS / 1000)
      setTimeout(() => {
        isFadingRef.current = false
        resolve()
      }, FADE_DURATION_MS + 100)
    })
  }

  function resetGain() {
    const ctx = audioContextRef.current
    const gain = gainNodeRef.current
    if (!ctx || !gain) return
    gain.gain.cancelScheduledValues(ctx.currentTime)
    gain.gain.setValueAtTime(volumeRef.current, ctx.currentTime)
  }

  // Preload all track files for the current variant using the Cache API.
  // Runs when enabled transitions to true, or when variant changes while enabled.
  useEffect(() => {
    if (!enabled) return
    if (typeof caches === 'undefined') return

    let cancelled = false
    setIsPreloading(true)
    setPreloadError(null)

    async function preload() {
      try {
        const cache = await caches.open(CACHE_NAME)
        const paths = getAllTrackPaths(variant)
        await Promise.all(
          paths.map(async path => {
            const match = await cache.match(path)
            if (!match) {
              const response = await fetch(path)
              if (!response.ok) throw new Error(`Failed to fetch ${path}`)
              await cache.put(path, response)
            }
          })
        )
      } catch (err) {
        if (!cancelled) setPreloadError(String(err))
      } finally {
        if (!cancelled) setIsPreloading(false)
      }
    }

    void preload()
    return () => {
      cancelled = true
    }
  }, [enabled, variant])

  // React to biome and enabled changes: fade out current and start new track.
  useEffect(() => {
    if (!audioRef.current) return

    const targetBiome: BiomeId | null =
      enabled && biome !== 'unexplored' ? biome : null

    // Same biome while enabled: do nothing.
    if (targetBiome === currentBiomeRef.current) return

    async function transition() {
      // Fade out current track if something is playing.
      if (currentBiomeRef.current !== null && audioRef.current) {
        await fadeOut()
        audioRef.current.pause()
        setIsPlaying(false)
      }

      currentBiomeRef.current = targetBiome

      if (!targetBiome || !audioRef.current) return

      const track = pickRandomTrack(targetBiome)
      const path = getTrackPath(track, variant)

      audioRef.current.src = path
      audioRef.current.load()

      getAudioContext()
      resetGain()

      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch {
        // Autoplay blocked — user must interact first via the play button.
        setIsPlaying(false)
      }
    }

    void transition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biome, enabled, variant])

  const setVolume = useCallback((v: number) => {
    volumeRef.current = v
    setVolumeState(v)
    if (gainNodeRef.current && audioContextRef.current && !isFadingRef.current) {
      gainNodeRef.current.gain.setValueAtTime(v, audioContextRef.current.currentTime)
    }
    if (audioRef.current) {
      audioRef.current.volume = v
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      getAudioContext()
      resetGain()
      void audioRef.current.play().then(() => setIsPlaying(true))
    } else {
      audioRef.current.pause()
      setIsPlaying(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { isPlaying, volume, setVolume, togglePlay, isPreloading, preloadError }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```
npm run build 2>&1 | tail -30
```

Expected: no errors in `useAudioPlayer.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useAudioPlayer.ts
git commit -m "feat: add useAudioPlayer hook with Web Audio fade transitions and Cache API preloading"
```

---

## Task 5: `AudioPlayer` component

**Files:**
- Create: `src/components/AudioPlayer/AudioPlayer.tsx`
- Create: `src/components/AudioPlayer/AudioPlayer.css`

- [ ] **Step 1: Create the CSS**

Create `src/components/AudioPlayer/AudioPlayer.css`:

```css
.AudioPlayer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-top: 1px solid var(--ant-color-border);
  margin-top: 16px;
}

.AudioPlayer-trackName {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: var(--ant-color-text-secondary);
}

.AudioPlayer-volume {
  width: 80px;
}

.AudioPlayer-error {
  font-size: 12px;
  color: var(--ant-color-error);
}
```

- [ ] **Step 2: Create the component**

Create `src/components/AudioPlayer/AudioPlayer.tsx`:

```typescript
'use client'

import {
  LoadingOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  SoundOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { App, Button, Slider, Space, Spin, Tooltip } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import type { BiomeId } from '@/lib/types'
import './AudioPlayer.css'

export function AudioPlayer({ biome }: { biome: BiomeId | 'unexplored' }) {
  const { settings } = useSettings()
  const t = useTranslations()
  const { notification } = App.useApp()

  const { isPlaying, volume, setVolume, togglePlay, isPreloading, preloadError } =
    useAudioPlayer({
      biome,
      enabled: settings.sound.enabled,
      variant: settings.sound.variant,
    })

  // Show a notification while preloading, dismiss when done.
  const notificationKeyRef = useRef('audio-preload')
  const wasPreloadingRef = useRef(false)

  useEffect(() => {
    if (isPreloading && !wasPreloadingRef.current) {
      wasPreloadingRef.current = true
      notification.info({
        key: notificationKeyRef.current,
        message: t('audio_player.preloading'),
        icon: <LoadingOutlined />,
        duration: 0,
        placement: 'bottomLeft',
      })
    } else if (!isPreloading && wasPreloadingRef.current) {
      wasPreloadingRef.current = false
      notification.success({
        key: notificationKeyRef.current,
        message: t('audio_player.preload_complete'),
        duration: 3,
        placement: 'bottomLeft',
      })
    }
  }, [isPreloading, notification, t])

  if (!settings.sound.enabled) return null

  return (
    <div className='AudioPlayer'>
      {isPreloading ? (
        <Spin indicator={<LoadingOutlined />} size='small' />
      ) : (
        <Tooltip
          title={isPlaying ? t('audio_player.pause') : t('audio_player.play')}>
          <Button
            type='text'
            size='small'
            icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
            onClick={togglePlay}
          />
        </Tooltip>
      )}

      {preloadError ? (
        <span className='AudioPlayer-error'>
          <WarningOutlined /> {t('audio_player.error')}
        </span>
      ) : null}

      <Space className='AudioPlayer-volume' align='center'>
        <SoundOutlined style={{ fontSize: 12 }} />
        <Slider
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={setVolume}
          style={{ width: 80 }}
          tooltip={{ formatter: v => `${Math.round((v ?? 0) * 100)}%` }}
        />
      </Space>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```
npm run build 2>&1 | tail -30
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/AudioPlayer/AudioPlayer.tsx src/components/AudioPlayer/AudioPlayer.css
git commit -m "feat: add AudioPlayer component with play/pause, volume slider, and preloading notification"
```

---

## Task 6: Mount `AudioPlayer` in `CharacterSheetShell`

**Files:**
- Modify: `src/components/CharacterSheetShell/CharacterSheetShell.tsx`

- [ ] **Step 1: Add the import and mount the component**

In `src/components/CharacterSheetShell/CharacterSheetShell.tsx`:

Add the import (with the other component imports near the top):

```typescript
import { AudioPlayer } from '@/components/AudioPlayer/AudioPlayer'
```

Inside the `<Spacing>` block, add `<AudioPlayer biome={bannerBiome} />` after the `{children}` line and before the `SettingsHint`:

```typescript
              {children}
              <AudioPlayer biome={bannerBiome} />
              {settings.sheet.singlePageMode && !isDead && (
```

The `bannerBiome` variable is already computed on line 58: `const bannerBiome = useBiomeAtCurrentMapPosition(form)`.

- [ ] **Step 2: Start the dev server and manually verify**

```
npm run dev
```

Navigate to a character sheet. In settings, enable "Background music". Confirm:
- The AudioPlayer widget appears at the bottom of the sheet.
- A "Preloading soundtracks…" notification appears.
- After preloading, "Music is ready to play." appears.
- If the character is on a biome cell, music starts playing.
- Moving to a different biome on the map fades the current track and starts a new one.
- Moving to the Core cell (E13, no biome) fades out and stops.
- Switching tabs does not restart the audio.

- [ ] **Step 3: Commit**

```bash
git add src/components/CharacterSheetShell/CharacterSheetShell.tsx
git commit -m "feat: mount AudioPlayer in CharacterSheetShell driven by current biome"
```

---

## Task 7: Settings page — sound section

**Files:**
- Modify: `src/components/PageSettings/Settings.tsx`

- [ ] **Step 1: Add the sound form field to `SettingsFormValues` and update `initialValues`, `handleReset`, and `handleValuesChange`**

In `src/components/PageSettings/Settings.tsx`:

Update the `SettingsFormValues` type to add:

```typescript
type SettingsFormValues = {
  adaptiveNightMode: boolean
  sheetSinglePageMode: boolean
  timelineReverseChronological: boolean
  villageMergeDuplicateEstablishments: boolean
  mapTickClockOnMove: boolean
  mapShowBiomeBackground: boolean
  mapCoordinatesDisplay: 'axes' | 'cells' | 'both'
  soundEnabled: boolean
  soundVariant: 'mix' | 'music' | 'ambiance'
}
```

Update `initialValues` to add:

```typescript
    soundEnabled: settings.sound.enabled,
    soundVariant: settings.sound.variant,
```

Update `handleReset` to add (after the existing map fields):

```typescript
      soundEnabled: DEFAULT_SETTINGS.sound.enabled,
      soundVariant: DEFAULT_SETTINGS.sound.variant,
```

Update `handleValuesChange` to add (after the `map` block):

```typescript
      sound: {
        ...prev.sound,
        enabled: allValues.soundEnabled === true,
        variant: allValues.soundVariant ?? 'mix',
      },
```

- [ ] **Step 2: Add the sound section UI**

In the JSX of `Settings.tsx`, add a new `<Row>` after the existing second `<Row gutter={[16, 16]}>`:

```tsx
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title={t('settings.section_sound')}>
                <Spacing size='small'>
                  <Form.Item
                    name='soundEnabled'
                    valuePropName='checked'
                    help={t('settings.sound_enabled_help')}>
                    <Checkbox>
                      {t('settings.sound_enabled_label')}
                    </Checkbox>
                  </Form.Item>
                  <Form.Item
                    name='soundVariant'
                    label={t('settings.sound_variant_label')}
                    help={t('settings.sound_variant_help')}
                    style={{ marginBottom: 0 }}>
                    <Select
                      options={[
                        {
                          value: 'mix',
                          label: t('settings.sound_variant_mix'),
                        },
                        {
                          value: 'music',
                          label: t('settings.sound_variant_music'),
                        },
                        {
                          value: 'ambiance',
                          label: t('settings.sound_variant_ambiance'),
                        },
                      ]}
                    />
                  </Form.Item>
                </Spacing>
              </Card>
            </Col>
          </Row>
```

- [ ] **Step 3: Verify in the browser**

Navigate to `/settings`. Confirm:
- A "Sound" card appears with an "Background music" checkbox.
- Enabling it triggers music preloading (notification).
- The variant selector works and changes which files are loaded.
- Reset button restores `soundEnabled: false` and `soundVariant: 'mix'`.

- [ ] **Step 4: Commit**

```bash
git add src/components/PageSettings/Settings.tsx
git commit -m "feat: add sound settings section with enable toggle and variant selector"
```

---

## Task 8: Cmd+M hotkey

**Files:**
- Modify: `src/hooks/useKeyboardShortcuts.tsx`

- [ ] **Step 1: Add useSettings and the Cmd+M handler**

In `src/hooks/useKeyboardShortcuts.tsx`, add the `useSettings` import:

```typescript
import { useSettings } from '@/components/PageSettings/SettingsContext'
```

Inside the `useKeyboardShortcuts` function body, after the existing hooks, add:

```typescript
  const { updateSettings } = useSettings()
```

Inside `handleKeyDown`, after the existing `if (isMeta && e.key === 'd')` block, add:

```typescript
        if (isMeta && e.key === 'm') {
          e.preventDefault()
          updateSettings(prev => ({
            ...prev,
            sound: { ...prev.sound, enabled: !prev.sound.enabled },
          }))
        }
```

Update the `useEffect` dependency array to include `updateSettings`:

```typescript
    [form, isDead, notification, t, updateSettings]
```

- [ ] **Step 2: Verify in the browser**

On a character sheet, press Cmd+M (or Ctrl+M on Windows/Linux). Confirm:
- Sound toggles on/off.
- If toggling on while on a biome cell, music starts.
- Pressing again stops the music.

- [ ] **Step 3: Run the full test suite**

```
npm run test
```

Expected: all tests pass.

- [ ] **Step 4: Run the linter**

```
npm run lint
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useKeyboardShortcuts.tsx
git commit -m "feat: add Cmd+M hotkey to toggle background music on/off"
```

---

## Self-Review

### Spec Coverage

| Requirement | Task |
|---|---|
| Biome → soundtrack mapping (6 biomes, 2 tracks each) | Task 1 |
| Core cell (E13, no biome) = silence | Handled in hook: biome='unexplored' → fade out + stop |
| Audio player widget at bottom of character sheet | Tasks 5–6 |
| Audio persists across tabs in multi-page mode | Task 6 — CharacterSheetShell is a Next.js layout |
| Sound setting (off by default) | Task 2 |
| Data size warning in settings | Task 3 (help text) + Task 7 (UI) |
| Cache API preloading — no re-download | Task 4 (`caches.open(CACHE_NAME)` checks `cache.match` first) |
| Pick random track per biome | Task 1 (`pickRandomTrack`) + Task 4 |
| Same biome → do nothing | Task 4 (`currentBiomeRef` check) |
| Different biome → fade out + start new | Task 4 |
| Core cell → fade out + stop | Task 4 |
| Play/pause widget | Task 5 |
| Volume control | Task 5 |
| Error state | Task 5 (`preloadError`) |
| Soundtrack variants (nice-to-have) | Tasks 1, 2, 3, 4, 7 |
| Cmd+M hotkey (nice-to-have) | Task 8 |
| Preloading notification | Task 5 (`notification.info`) |

### Placeholder Scan

No TBDs, TODOs, or "similar to above" patterns found.

### Type Consistency

- `SoundVariant = 'mix' | 'music' | 'ambiance'` — defined in `catalog.ts`, imported in `types.ts`, `model.ts`, `useAudioPlayer.ts`, `Settings.tsx`
- `TrackEntry` — defined in `catalog.ts`, used in `useAudioPlayer.ts`
- `BiomeId` — already defined in `src/lib/types.ts`, used throughout
- `AudioPlayerState` — defined and returned by `useAudioPlayer`, consumed in `AudioPlayer.tsx`
- `getTrackPath`, `getAllTrackPaths`, `getTracksForBiome`, `pickRandomTrack` — defined in `catalog.ts`, used in `useAudioPlayer.ts`; tested in `catalog.test.ts`
