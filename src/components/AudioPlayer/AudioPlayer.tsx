'use client'

/**
 * Biome soundtrack player with crossfade on biome change.
 *
 * Why this file is tricky:
 * - Changing the `src` attribute causes the audio element to be re-rendered and
 *   reloaded, which causes the current playback to be interrupted. This is a
 *   disruptive behavior, and we want to fade out the current soundtrack.
 *
 * Notes about the implementation:
 * - We cannot put `src={url}` on `<audio>` and rely only on React: when `url`
 *   changes, React updates the attribute before our effects run, so we lose the
 *   *previous* URL and cannot keep the old track playing while a second element
 *   (the “ghost”) spins up.
 * - So the visible `<audio>` has **no** `src` in JSX; we assign `el.src` in
 *  `useLayoutEffect` and track the last committed URL ourselves in `prevUrlRef`.
 * - On transition while the main element is **playing**, we spawn a hidden
 *  `Audio()` (ghost) with the *previous* URL, seek it to the same `currentTime`,
 *   and only after the ghost is actually audible do we pause the main element
 *   and point it at the new file. That avoids a short gap of silence (main
 *   cleared before ghost could play).
 * - Fade-out runs on the ghost over FADE_OUT_MS while the new track loads/plays
 *   on main.
 */

import { useLayoutEffect, useMemo, useRef } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { getTrackPath, pickRandomTrack } from '@/lib/sounds/catalog'
import type { PossibleBiomeId } from '@/lib/types'

import './AudioPlayer.css'

// How long the *outgoing* (ghost) copy of the old track takes to reach volume 0
const FADE_OUT_MS = 5_000

// If the ghost never reaches `playing` (decode stall, odd browser behavior), we
// still must switch the main element to the new biome — otherwise the UI would
// wait forever.
const GHOST_HANDOFF_FALLBACK_MS = 3_000

/**
 * Owns all imperative audio logic: refs, crossfade, autoplay-after-gesture, and
 * cleanup.
 *
 * @param enabled - Sound disabled in settings: tear everything down and clear URLs.
 * @param url - Resolved MP3 path for the current biome+variant, or null if unexplored.
 */
const useFadeOut = (enabled: boolean, url: string | null) => {
  // The visible `<audio>` element in the DOM.
  const audioRef = useRef<HTMLAudioElement>(null)

  // Last URL we successfully committed to the main element (or handed off to
  // after ghost). Compared to incoming `url` to detect real transitions vs
  // React re-runs with same URL.
  const prevUrlRef = useRef<string | null>(null)

  // Browsers block `play()` without a recent user gesture. After the user hits
  // play once, we set this so biome changes can call `play()` on the new track
  // without another click.
  const userActivatedRef = useRef(false)

  // The hidden `Audio()` used only during biome transition (old track fading
  // out).
  const outgoingAudioRef = useRef<HTMLAudioElement | null>(null)

  // `requestAnimationFrame` id for the ghost volume ramp; must cancel on
  // teardown.
  const outgoingRafRef = useRef<number | null>(null)

  useLayoutEffect(() => {
    /**
     * Stops any in-progress ghost fade and drops the ghost element.
     * Safe to call when starting a new transition or disabling sound.
     */
    const cancelOutgoing = () => {
      if (outgoingRafRef.current !== null) {
        cancelAnimationFrame(outgoingRafRef.current)
        outgoingRafRef.current = null
      }
      const ghost = outgoingAudioRef.current
      if (ghost) {
        ghost.pause()
        ghost.removeAttribute('src')
        ghost.load()
        outgoingAudioRef.current = null
      }
    }

    /**
     * Linear volume ramp on the ghost from its current volume down to 0, then
     * full teardown. Started only *after* the ghost is known to be producing
     * sound (see handoff), so we do not fade silence while the decoder is still
     * catching up.
     */
    const fadeOutGhost = (ghost: HTMLAudioElement) => {
      const startVol = ghost.volume
      const start = performance.now()

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / FADE_OUT_MS)
        ghost.volume = Math.max(0, startVol * (1 - t))
        if (t < 1) {
          outgoingRafRef.current = requestAnimationFrame(tick)
        } else {
          outgoingRafRef.current = null
          ghost.pause()
          ghost.removeAttribute('src')
          ghost.load()
          if (outgoingAudioRef.current === ghost) {
            outgoingAudioRef.current = null
          }
        }
      }

      outgoingRafRef.current = requestAnimationFrame(tick)
    }

    const el = audioRef.current
    const prev = prevUrlRef.current

    // Sound turned off: stop main + ghost, forget committed URL.
    if (!enabled) {
      cancelOutgoing()
      prevUrlRef.current = null
      if (el) {
        el.pause()
        el.removeAttribute('src')
        el.load()
      }
      return
    }

    // Nothing to do: same resolved URL as last commit (e.g. re-render, strict
    // mode no-op).
    if (url === prev) return

    // Unexplored / no track: clear players.
    if (url === null) {
      cancelOutgoing()
      prevUrlRef.current = null
      if (el) {
        el.pause()
        el.removeAttribute('src')
        el.load()
      }
      return
    }

    /**
     * Ref not attached yet (e.g. first paint edge). Do **not** write `prevUrlRef` here:
     * if we set `prevUrlRef === url` without assigning `el.src`, the next effect would see
     * `url === prev` and skip loading forever.
     */
    if (!el) {
      return
    }

    // --- Per-effect-run flags for the async ghost handoff path ---

    /** Effect cleanup or fast biome spam: abort ghost callbacks without touching new state. */
    let cancelled = false

    /**
     * `playing` / `play().catch` / fallback timer can all race; only the first handoff wins.
     */
    let handoffDone = false

    /** Timer handle for GHOST_HANDOFF_FALLBACK_MS; cleared when handoff runs. */
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined

    const clearFallback = () => {
      if (fallbackTimer !== undefined) {
        clearTimeout(fallbackTimer)
        fallbackTimer = undefined
      }
    }

    /**
     * Final step of a **playing** → new biome transition:
     * 1. Pause the main element (it was still outputting the old file until now).
     * 2. Start fading the ghost (which is now the audible continuation of that file).
     * 3. Point main at the *new* URL, load, and `play()` if the user already activated audio.
     * 4. Record `prevUrlRef` so we do not re-run this for the same URL.
     */
    const handoffToNewMain = (ghost: HTMLAudioElement) => {
      if (cancelled || handoffDone) return
      handoffDone = true
      clearFallback()
      el.pause()
      fadeOutGhost(ghost)
      el.src = url
      el.load()

      const tryPlay = () => {
        if (!userActivatedRef.current) return
        void el.play().catch(() => {
          // Autoplay still blocked or load interrupted — user can use controls
        })
      }

      el.addEventListener('canplay', tryPlay, { once: true })
      tryPlay()
      prevUrlRef.current = url
    }

    /**
     * --- Crossfade path: main was playing the previous biome ---
     *
     * We snapshot `resumeTime` / `resumeVol` now because later async callbacks must not read
     * `el.currentTime` after we have already changed `el.src`.
     *
     * Flow:
     * 1. Ghost loads `prev` (same file main was playing).
     * 2. On `loadedmetadata`, seek ghost to `resumeTime` and call `play()`.
     * 3. On `playing`, the ghost is definitely audible → hand off to new main + fade ghost.
     * 4. If `play()` rejects or `playing` never fires, fallback timer still hands off so we
     *    never strand the UI on the old biome’s file forever.
     *
     * While steps 1–3 run, the **main** element is left unchanged — it keeps decoding and
     * playing the old URL, which removes the “blip of silence” that happens if we cleared
     * `el.src` immediately.
     */
    if (prev !== null && !el.paused) {
      cancelOutgoing()
      const resumeTime = el.currentTime
      const resumeVol = el.volume
      const ghost = new Audio(prev)
      ghost.loop = true
      ghost.volume = resumeVol
      outgoingAudioRef.current = ghost

      /** Stored so effect cleanup can remove `playing` if we unmount mid-load. */
      let onPlayingHandler: (() => void) | null = null

      const onReady = () => {
        ghost.removeEventListener('loadedmetadata', onReady)
        try {
          ghost.currentTime = resumeTime
        } catch {
          // Ignore seek errors on some browsers if metadata not ready enough
        }

        const onPlaying = () => {
          ghost.removeEventListener('playing', onPlaying)
          handoffToNewMain(ghost)
        }
        onPlayingHandler = onPlaying

        ghost.addEventListener('playing', onPlaying, { once: true })
        void ghost.play().catch(() => {
          if (onPlayingHandler) {
            ghost.removeEventListener('playing', onPlayingHandler)
          }
          handoffToNewMain(ghost)
        })

        fallbackTimer = setTimeout(() => {
          if (onPlayingHandler) {
            ghost.removeEventListener('playing', onPlayingHandler)
          }
          handoffToNewMain(ghost)
        }, GHOST_HANDOFF_FALLBACK_MS)
      }

      ghost.addEventListener('loadedmetadata', onReady)
      ghost.load()

      return () => {
        cancelled = true
        clearFallback()
        ghost.removeEventListener('loadedmetadata', onReady)
        if (onPlayingHandler) {
          ghost.removeEventListener('playing', onPlayingHandler)
        }
      }
    }

    // --- Simple path: first track, or main was paused (no need to overlap old audio) ---

    cancelOutgoing()

    el.src = url
    el.load()

    const tryPlay = () => {
      if (!userActivatedRef.current) return
      void el.play().catch(() => {
        // Autoplay still blocked or load interrupted — user can use controls
      })
    }

    el.addEventListener('canplay', tryPlay, { once: true })
    tryPlay()

    prevUrlRef.current = url

    return () => {
      el.removeEventListener('canplay', tryPlay)
    }
  }, [enabled, url])

  /**
   * Component unmount: stop any orphan ghost or rAF even if the main effect did not run.
   */
  useLayoutEffect(() => {
    return () => {
      if (outgoingRafRef.current !== null) {
        cancelAnimationFrame(outgoingRafRef.current)
        outgoingRafRef.current = null
      }

      const ghost = outgoingAudioRef.current
      if (ghost) {
        ghost.pause()
        ghost.removeAttribute('src')
        ghost.load()
        outgoingAudioRef.current = null
      }
    }
  }, [])

  return { audioRef, userActivatedRef }
}

export function AudioPlayer({ biome }: { biome: PossibleBiomeId }) {
  const { settings } = useSettings()
  const enabled = settings.sound.enabled

  // Pick one random track per (biome, variant). **Must** be memoized: the
  // `pickRandomTrack` function is random on every call; without `useMemo` a
  // parent re-render would swap URLs constantly.
  const url = useMemo(
    () =>
      biome !== 'unexplored'
        ? getTrackPath(pickRandomTrack(biome), settings.sound.variant)
        : null,
    [biome, settings.sound.variant]
  )

  const { audioRef, userActivatedRef } = useFadeOut(enabled, url)

  if (!enabled) return null
  if (!url) return null

  return (
    <audio
      ref={audioRef}
      controls
      loop
      className='AudioPlayer__native'
      controlsList='nodownload'
      // Any successful start of playback counts as user activation for autoplay
      // policy.
      onPlay={() => (userActivatedRef.current = true)}
    />
  )
}
