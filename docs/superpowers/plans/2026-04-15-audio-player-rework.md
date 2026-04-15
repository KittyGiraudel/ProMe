# Audio Player Rework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two-player layout with a single player featuring prev/next track navigation, a biome-themed rule-line decoration, and a consistent look across both the biome page and character sheet.

**Architecture:** A new `useTrackSelector` hook owns track-index state and navigation. `AudioPlayer` gains optional `onPrev`/`onNext` props and a new three-row layout (name + rules → progress → controls + volume). Both `BiomeAudio` and `AudioCard` drive the player through `useTrackSelector`. Biome theming is CSS-only via `var(--biome-accent, var(--ant-color-primary))` — no props, no context.

**Tech Stack:** Next.js App Router, React, TypeScript, Ant Design (icons + Slider + Tooltip), Howler.js (untouched), Biome formatter (no semis, single quotes), ESLint.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/components/AudioPlayer/useTrackSelector.ts` | Track index state + prev/next navigation |
| Modify | `src/components/AudioPlayer/AudioPlayer.tsx` | New layout, optional prev/next props, biome rule-line, updated media session wiring |
| Modify | `src/components/AudioPlayer/AudioPlayer.css` | Three-row layout, rule-line decoration, biome token fallbacks, smaller volume slider |
| Modify | `src/components/PageBiome/BiomeAudio.tsx` | Single player via useTrackSelector, remove two-player grid |
| Modify | `src/components/PageBiome/BiomeAudio.css` | Remove grid, keep wrapper card style |
| Modify | `src/components/AudioCard/AudioCard.tsx` | Use useTrackSelector instead of useBiomeTrack |
| Delete | `src/components/AudioPlayer/useBiomeTrack.ts` | No callers remain |

---

## Task 1: Create `useTrackSelector`

**Files:**
- Create: `src/components/AudioPlayer/useTrackSelector.ts`

- [ ] **Step 1: Create the hook**

```ts
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { getTrackPath, getTracksForBiome } from '@/lib/sounds/catalog'
import type { PossibleBiomeId } from '@/lib/types'

export function useTrackSelector(biome: PossibleBiomeId) {
  const { settings } = useSettings()
  const [trackIndex, setTrackIndex] = useState(0)

  // Reset to first track whenever the biome changes
  useEffect(() => {
    setTrackIndex(0)
  }, [biome])

  const tracks = useMemo(() => {
    if (biome === 'unexplored') return null
    return getTracksForBiome(biome)
  }, [biome])

  const track = tracks?.[trackIndex] ?? null
  const trackCount = tracks?.length ?? 0

  const url = useMemo(
    () => (track ? getTrackPath(track, settings.sound.variant) : null),
    [track, settings.sound.variant]
  )

  const goToPrev = useCallback(
    () => setTrackIndex(i => (i - 1 + trackCount) % trackCount),
    [trackCount]
  )

  const goToNext = useCallback(
    () => setTrackIndex(i => (i + 1) % trackCount),
    [trackCount]
  )

  return { url, name: track?.name, trackIndex, trackCount, goToPrev, goToNext }
}
```

- [ ] **Step 2: Verify it type-checks**

```bash
npx tsc --noEmit
```

Expected: no errors involving `useTrackSelector`.

- [ ] **Step 3: Commit**

```bash
git add src/components/AudioPlayer/useTrackSelector.ts
git commit -m "Add useTrackSelector hook for track index navigation"
```

---

## Task 2: Rework `AudioPlayer` component

**Files:**
- Modify: `src/components/AudioPlayer/AudioPlayer.tsx`

The changes: add optional `onPrev`/`onNext` props; swap the restart button for prev/next buttons with Tooltips; reorder JSX rows to name-first → progress → controls; wire `onPrev` into the media session `previoustrack` handler.

- [ ] **Step 1: Replace `AudioPlayer.tsx` with the new implementation**

```tsx
import PauseOutlined from '@ant-design/icons/lib/icons/PauseOutlined'
import PlayCircleOutlined from '@ant-design/icons/lib/icons/PlayCircleOutlined'
import StepBackwardOutlined from '@ant-design/icons/lib/icons/StepBackwardOutlined'
import StepForwardOutlined from '@ant-design/icons/lib/icons/StepForwardOutlined'
import { Slider, Tooltip, Typography } from 'antd'
import { Howl } from 'howler'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/Button/Button'
import { getPWADisplayMode } from '@/lib/getPWADisplayMode'
import { PossibleBiomeId } from '@/lib/types'
import { useMediaSession } from './useMediaSession'

import './AudioPlayer.css'

const FADE_DURATION_MS = 5_000

export function AudioPlayer({
  biome,
  name,
  url,
  onPrev,
  onNext,
}: {
  biome: PossibleBiomeId
  name?: string
  url: string
  onPrev?: () => void
  onNext?: () => void
}) {
  const howl = useRef<Howl | null>(null)
  const volumeRef = useRef(0.8)
  const wasPlayingRef = useRef(false)
  const [volume, setVolume] = useState(0.8)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const buildHowl = useCallback((src: string) => {
    const sound = new Howl({
      src: [src],
      format: ['mp3'],
      html5: true,
      loop: true,
      volume: volumeRef.current,
      autoplay: getPWADisplayMode() === 'standalone',
      onload: () => setDuration(sound.duration()),
      onplay: () => {
        setIsPlaying(true)
        wasPlayingRef.current = true
      },
      onpause: () => {
        setIsPlaying(false)
        wasPlayingRef.current = false
      },
    })
    return sound
  }, [])

  useEffect(
    function handleBiomeChange() {
      const wasPlaying = wasPlayingRef.current

      if (howl.current) {
        howl.current.fade(volumeRef.current, 0, FADE_DURATION_MS)
      }

      if (!url) {
        setIsPlaying(false)
        setCurrentTime(0)
        wasPlayingRef.current = false
        return
      }

      if (!wasPlaying) {
        howl.current = null
        return
      }

      const sound = buildHowl(url)
      sound.play()
      howl.current = sound

      return () => {
        sound.fade(volumeRef.current, 0, FADE_DURATION_MS)
        setTimeout(() => sound.unload(), FADE_DURATION_MS)
        howl.current = null
      }
    },
    [url, buildHowl]
  )

  useEffect(function cleanup() {
    return () => {
      if (howl.current) {
        howl.current.fade(volumeRef.current, 0, FADE_DURATION_MS)
        const sound = howl.current
        setTimeout(() => sound.unload(), FADE_DURATION_MS)
        howl.current = null
      }
    }
  }, [])

  useEffect(
    function pollCurrentTime() {
      if (!isPlaying) return
      const id = setInterval(
        () => setCurrentTime(howl.current?.seek() ?? 0),
        1_000
      )
      return () => clearInterval(id)
    },
    [isPlaying]
  )

  const togglePlay = useCallback(() => {
    if (!howl.current) {
      if (!url) return
      const sound = buildHowl(url)
      sound.play()
      howl.current = sound
      return
    }
    if (howl.current.playing()) howl.current.pause()
    else howl.current.play()
  }, [url, buildHowl])

  const seekTo = useCallback((time: number) => {
    howl.current?.seek(time)
    setCurrentTime(time)
  }, [])

  useMediaSession({
    biome,
    trackName: name,
    isPlaying,
    currentTime,
    duration,
    onPlay: togglePlay,
    onPause: togglePlay,
    onSeekTo: seekTo,
    onPrevTrack: onPrev,
  })

  const changeVolume = useCallback((value: number) => {
    volumeRef.current = value
    setVolume(value)
    howl.current?.volume(value)
  }, [])

  return (
    <div className='AudioPlayer'>
      <div className='AudioPlayer__titleRow'>
        <span className='AudioPlayer__rule' />
        <Typography.Text className='AudioPlayer__trackName'>{name}</Typography.Text>
        <span className='AudioPlayer__rule' />
      </div>
      <div className='AudioPlayer__progressRow'>
        <span>{formatTime(currentTime)}</span>
        <Slider
          min={0}
          max={duration}
          step={1}
          value={currentTime}
          onChange={seekTo}
          tooltip={{ formatter: v => formatTime(v ?? 0) }}
          className='AudioPlayer__progress'
        />
        <span>{formatTime(duration)}</span>
      </div>
      <div className='AudioPlayer__controls'>
        <div className='AudioPlayer__controlsLeft'>
          {onPrev && (
            <Tooltip title='Previous track'>
              <Button onClick={onPrev} htmlType='button' size='small'>
                <StepBackwardOutlined />
              </Button>
            </Tooltip>
          )}
          <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
            <Button
              onClick={togglePlay}
              htmlType='button'
              size='small'
              disabled={!url}>
              {isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
            </Button>
          </Tooltip>
          {onNext && (
            <Tooltip title='Next track'>
              <Button onClick={onNext} htmlType='button' size='small'>
                <StepForwardOutlined />
              </Button>
            </Tooltip>
          )}
        </div>
        <div className='AudioPlayer__controlsRight'>
          <Slider
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={changeVolume}
            className='AudioPlayer__volumeSlider'
          />
        </div>
      </div>
    </div>
  )
}

function formatTime(timeInSeconds: number) {
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = Math.floor(timeInSeconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
```

- [ ] **Step 2: Update `useMediaSession` to accept and use `onPrevTrack`**

`useMediaSession.ts` currently hardcodes `previoustrack` as `() => onSeekTo(0)`. Add the optional callback:

In `src/components/AudioPlayer/useMediaSession.ts`, update the `Props` type and the `setActionHandlers` effect:

```ts
type Props = {
  biome: PossibleBiomeId
  trackName: string | undefined
  isPlaying: boolean
  currentTime: number
  duration: number
  onPlay: () => void
  onPause: () => void
  onSeekTo: (time: number) => void
  onPrevTrack?: () => void
}
```

In the `setActionHandlers` effect, update the destructuring to include `onPrevTrack` and replace the `previoustrack` handler:

```ts
export function useMediaSession({
  biome,
  trackName,
  isPlaying,
  currentTime,
  duration,
  onPlay,
  onPause,
  onSeekTo,
  onPrevTrack,
}: Props) {
```

And in the `setActionHandlers` effect body, replace:
```ts
navigator.mediaSession.setActionHandler('previoustrack', () =>
  onSeekTo(0)
)
```
with:
```ts
navigator.mediaSession.setActionHandler('previoustrack', onPrevTrack ?? null)
```

Also add `onPrevTrack` to the effect's dependency array:
```ts
[onPlay, onPause, onSeekTo, onPrevTrack, currentTime, duration]
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/AudioPlayer/AudioPlayer.tsx src/components/AudioPlayer/useMediaSession.ts
git commit -m "Rework AudioPlayer: new layout, prev/next props, media session wiring"
```

---

## Task 3: Rework `AudioPlayer.css`

**Files:**
- Modify: `src/components/AudioPlayer/AudioPlayer.css`

- [ ] **Step 1: Replace the stylesheet**

```css
.AudioPlayer {
  display: flex;
  flex-direction: column;
  gap: 0.4em;
}

/* ── Title row: rule · name · rule ───────────────────────────── */

.AudioPlayer__titleRow {
  display: flex;
  align-items: center;
  gap: 0.6em;
}

.AudioPlayer__rule {
  flex: 1;
  height: 1px;
  background: var(--biome-accent, var(--ant-color-primary));
  opacity: 0.35;
}

.AudioPlayer__trackName {
  color: inherit !important;
  font-size: 0.85em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60%;
}

/* ── Progress row ─────────────────────────────────────────────── */

.AudioPlayer__progressRow {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.AudioPlayer__progress {
  flex: 1;
}

/* ── Controls row ─────────────────────────────────────────────── */

.AudioPlayer__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.AudioPlayer__controlsLeft {
  display: flex;
  gap: 0.5em;
}

.AudioPlayer__volumeSlider {
  min-width: 64px;
  max-width: 64px;
}

/* ── Slider rail tint ─────────────────────────────────────────── */

.AudioPlayer__progress .ant-slider-rail,
.AudioPlayer__volumeSlider .ant-slider-rail {
  border: 1px solid light-dark(rgb(0 0 0 / 0.1), rgb(255 255 255 / 0.1));
}
```

- [ ] **Step 2: Start dev server and do a visual check**

```bash
npm run dev
```

Open `http://localhost:3000` in a browser. Navigate to any biome page (e.g. `/fr/biomes/shadowForest`) and verify:
- Single player with rule lines around the track name
- Progress bar in the middle
- Prev / play-pause / next buttons on the bottom-left, volume slider on the bottom-right
- Volume slider is noticeably narrower than before (~64 px)
- Check both light and dark theme (toggle in settings)

Then open a character sheet and confirm the player also appears there with the new layout.

- [ ] **Step 3: Commit**

```bash
git add src/components/AudioPlayer/AudioPlayer.css
git commit -m "Restyle AudioPlayer: three-row layout, rule-line decoration, biome token fallbacks"
```

---

## Task 4: Update `BiomeAudio`

**Files:**
- Modify: `src/components/PageBiome/BiomeAudio.tsx`
- Modify: `src/components/PageBiome/BiomeAudio.css`

- [ ] **Step 1: Replace `BiomeAudio.tsx`**

```tsx
import { useTranslations } from 'next-intl'
import { AudioPlayer } from '@/components/AudioPlayer/AudioPlayer'
import { useTrackSelector } from '@/components/AudioPlayer/useTrackSelector'
import { BiomeId } from '@/lib/types'
import { BiomeSection } from './BiomeSection'

import './BiomeAudio.css'

export function BiomeAudio({ biome }: { biome: BiomeId }) {
  const t = useTranslations()
  const { url, name, goToPrev, goToNext } = useTrackSelector(biome)

  if (!url) return null

  return (
    <BiomeSection
      title={t('audio_player.title')}
      className='BiomeAudio'
      id='biome-audio'>
      <div className='BiomeAudio__wrapper'>
        <AudioPlayer
          biome={biome}
          name={name}
          url={url}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      </div>
    </BiomeSection>
  )
}
```

- [ ] **Step 2: Replace `BiomeAudio.css`**

Remove the two-player grid; keep the wrapper card style:

```css
.BiomeAudio__wrapper {
  background: var(--biome-surface);
  color: var(--biome-text);
  border: 1px solid var(--biome-border);
  border-radius: 0.6em;
  padding: 1em 1.2em;
}
```

- [ ] **Step 3: Type-check and lint**

```bash
npx tsc --noEmit && npm run lint
```

Expected: no errors.

- [ ] **Step 4: Visual check on the biome page**

With the dev server running (`npm run dev`), open a biome page. Verify:
- One player visible (not two)
- Prev/next buttons switch between the two tracks
- When a track is playing and you switch, the old track fades out and the new one fades in (≈5 s crossfade)
- The player picks up the biome accent colour for the rule lines
- Works in both light and dark theme

- [ ] **Step 5: Commit**

```bash
git add src/components/PageBiome/BiomeAudio.tsx src/components/PageBiome/BiomeAudio.css
git commit -m "BiomeAudio: single player with prev/next via useTrackSelector"
```

---

## Task 5: Update `AudioCard`

**Files:**
- Modify: `src/components/AudioCard/AudioCard.tsx`

- [ ] **Step 1: Replace `AudioCard.tsx`**

```tsx
import { Card, Skeleton } from 'antd'
import { useTranslations } from 'next-intl'
import { AudioPlayer } from '@/components/AudioPlayer/AudioPlayer'
import { useTrackSelector } from '@/components/AudioPlayer/useTrackSelector'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { useSoundtrackPreload } from '@/hooks/useSoundtrackPreload'
import { PossibleBiomeId } from '@/lib/types'
import { useSoundtrackPreloadNotification } from './useSoundtrackPreloadNotification'

export function AudioCard({ biome }: { biome: PossibleBiomeId }) {
  const t = useTranslations()
  const { settings } = useSettings()
  const preloadStatus = useSoundtrackPreload({
    enabled: settings.sound.enabled,
    variant: settings.sound.variant,
  })
  const { url, name, goToPrev, goToNext } = useTrackSelector(biome)

  useSoundtrackPreloadNotification(preloadStatus)

  if (!settings.sound.enabled) return null

  if (preloadStatus === 'loading') {
    return (
      <Card title={t('audio_player.title')} id='audio'>
        <Skeleton active />
      </Card>
    )
  }

  if (!url) return null

  return (
    <Card title={t('audio_player.title')} id='audio'>
      <AudioPlayer biome={biome} name={name} url={url} onPrev={goToPrev} onNext={goToNext} />
    </Card>
  )
}
```

- [ ] **Step 2: Type-check and lint**

```bash
npx tsc --noEmit && npm run lint
```

Expected: no errors.

- [ ] **Step 3: Visual check on the character sheet**

Open a character sheet in the browser. Verify:
- The audio card shows a single player with prev/next buttons
- Prev/next cycle between the two biome tracks
- Crossfade plays when switching tracks while audio is playing
- Rule lines use Ant Design primary colour (not a biome accent), in both light and dark mode

- [ ] **Step 4: Commit**

```bash
git add src/components/AudioCard/AudioCard.tsx
git commit -m "AudioCard: use useTrackSelector for track navigation"
```

---

## Task 6: Delete `useBiomeTrack`

**Files:**
- Delete: `src/components/AudioPlayer/useBiomeTrack.ts`

- [ ] **Step 1: Confirm no remaining callers**

```bash
grep -r 'useBiomeTrack' src/
```

Expected: no output (only the file itself would appear — confirm it's empty of external references).

- [ ] **Step 2: Delete the file**

```bash
rm src/components/AudioPlayer/useBiomeTrack.ts
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add -u src/components/AudioPlayer/useBiomeTrack.ts
git commit -m "Remove useBiomeTrack — replaced by useTrackSelector"
```

---

## Task 7: Final verification

- [ ] **Step 1: Run full lint and type-check**

```bash
npm run lint && npx tsc --noEmit
```

Expected: no errors or warnings introduced by this work.

- [ ] **Step 2: Run tests**

```bash
npm run test
```

Expected: all tests pass (the changed files are in `src/components/`, which is outside the tested scope — but confirm nothing in `src/lib/` or `src/hooks/` broke).

- [ ] **Step 3: End-to-end smoke test**

With `npm run dev` running, verify all four scenarios:

| Scenario | What to check |
|----------|---------------|
| Biome page, dark theme | Single player, rule lines tinted with biome accent, prev/next work, crossfade on track switch |
| Biome page, light theme | Same, light palette |
| Character sheet, dark theme | Player in Ant card, rule lines use primary blue, prev/next work |
| Character sheet, light theme | Same, light palette |
