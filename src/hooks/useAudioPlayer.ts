'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getTrackPath,
  pickRandomTrack,
  type SoundVariant,
  type TrackEntry,
} from '@/lib/sounds/catalog'
import type { BiomeId, PossibleBiomeId } from '@/lib/types'

export type AudioPlayerState = {
  isPlaying: boolean
  volume: number
  setVolume: (v: number) => void
  togglePlay: () => void
  currentTrack: TrackEntry | null
  currentTime: number
  duration: number
  seekTo: (time: number) => void
  /** Seek to the start of the current track. */
  restartFromBeginning: () => void
  /** Fade out and start another random track for the current biome (no-op if idle). */
  pickNewRandomTrack: () => void
}

const FADE_DURATION_MS = 5_000

/** play() rejects if paused, load(), or src change interrupts before playback starts. */
function isBenignPlayRejection(error: unknown): boolean {
  if (!(error instanceof DOMException)) return false
  return error.name === 'AbortError' || error.message.includes('interrupted')
}

export function useAudioPlayer({
  biome,
  enabled,
  variant,
}: {
  biome: PossibleBiomeId
  enabled: boolean
  variant: SoundVariant
}): AudioPlayerState {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentBiomeRef = useRef<BiomeId | null>(null)
  const volumeRef = useRef(0.8)
  const isFadingRef = useRef(false)
  const fadeRafRef = useRef<number | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.8)
  const [currentTrack, setCurrentTrack] = useState<TrackEntry | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  function cancelVolumeFade() {
    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current)
      fadeRafRef.current = null
    }
    isFadingRef.current = false
  }

  // Create HTMLAudioElement once on mount; attach time/duration listeners
  useEffect(() => {
    const audio = new Audio()
    audio.loop = true
    audio.volume = volumeRef.current
    audioRef.current = audio

    const syncDuration = () =>
      setDuration(
        !Number.isFinite(audio.duration) || Number.isNaN(audio.duration)
          ? 0
          : audio.duration
      )

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = syncDuration
    const onLoadedMetadata = syncDuration

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)

    return () => {
      cancelVolumeFade()
      audio.pause()
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audioRef.current = null
    }
  }, [])

  function fadeOut(): Promise<void> {
    cancelVolumeFade()
    return new Promise(resolve => {
      const el = audioRef.current
      if (!el) return resolve()
      isFadingRef.current = true
      const startVol = el.volume
      const startTime = performance.now()

      function tick(now: number) {
        const target = audioRef.current
        if (!target) {
          cancelVolumeFade()
          resolve()
          return
        }
        const t = Math.min(1, (now - startTime) / FADE_DURATION_MS)
        target.volume = Math.max(0, startVol * (1 - t))
        if (t < 1) {
          fadeRafRef.current = requestAnimationFrame(tick)
        } else {
          fadeRafRef.current = null
          isFadingRef.current = false
          resolve()
        }
      }

      fadeRafRef.current = requestAnimationFrame(tick)
    })
  }

  function resetOutputVolume() {
    cancelVolumeFade()
    const el = audioRef.current
    if (el) el.volume = volumeRef.current
  }

  // React to biome and enabled changes: fade out current and start new track
  useEffect(() => {
    if (!audioRef.current) return

    const targetBiome: BiomeId | null =
      enabled && biome !== 'unexplored' ? biome : null

    // Same biome while enabled: do nothing
    if (targetBiome === currentBiomeRef.current) return

    let cancelled = false

    async function transition() {
      // Fade out current track if something is playing
      if (currentBiomeRef.current !== null && audioRef.current) {
        await fadeOut()
        if (cancelled) return
        audioRef.current.pause()
        setIsPlaying(false)
      }

      if (cancelled) return
      currentBiomeRef.current = targetBiome

      if (!targetBiome || !audioRef.current) {
        if (!cancelled) {
          setCurrentTrack(null)
          setCurrentTime(0)
          setDuration(0)
        }
        return
      }

      const track = pickRandomTrack(targetBiome)
      if (!cancelled) {
        setCurrentTrack(track)
        setCurrentTime(0)
        setDuration(0)
      }
      const path = getTrackPath(track, variant)

      audioRef.current.src = path
      audioRef.current.load()

      resetOutputVolume()

      try {
        await audioRef.current.play()
        if (!cancelled) setIsPlaying(true)
      } catch (error) {
        if (cancelled) return
        if (isBenignPlayRejection(error)) {
          setIsPlaying(audioRef.current ? !audioRef.current.paused : false)
          return
        }
        // Autoplay blocked (NotAllowedError) or other failure
        setIsPlaying(false)
      }
    }

    void transition()

    return () => {
      cancelled = true
    }
  }, [biome, enabled, variant])

  const setVolume = useCallback((v: number) => {
    volumeRef.current = v
    setVolumeState(v)
    if (audioRef.current && !isFadingRef.current) {
      audioRef.current.volume = v
    }
  }, [])

  const seekTo = useCallback((time: number) => {
    const el = audioRef.current
    if (!el) return
    const d = el.duration
    const max = Number.isFinite(d) && d > 0 ? d : Number.POSITIVE_INFINITY
    const clamped =
      max === Number.POSITIVE_INFINITY
        ? Math.max(0, time)
        : Math.min(Math.max(0, time), max)
    el.currentTime = clamped
    setCurrentTime(clamped)
  }, [])

  const restartFromBeginning = useCallback(() => seekTo(0), [seekTo])

  const pickNewRandomTrack = useCallback(() => {
    const biome = currentBiomeRef.current
    if (!biome || !audioRef.current) return
    const activeBiome: BiomeId = biome

    async function run() {
      await fadeOut()
      if (!audioRef.current) return
      audioRef.current.pause()
      setIsPlaying(false)

      const track = pickRandomTrack(activeBiome)
      setCurrentTrack(track)
      setCurrentTime(0)
      setDuration(0)
      const path = getTrackPath(track, variant)

      audioRef.current.src = path
      audioRef.current.load()

      resetOutputVolume()

      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch (error) {
        if (isBenignPlayRejection(error)) {
          setIsPlaying(audioRef.current ? !audioRef.current.paused : false)
          return
        }
        setIsPlaying(false)
      }
    }

    void run()
  }, [variant])

  const togglePlay = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    if (el.paused) {
      resetOutputVolume()
      void el.play().then(
        () => setIsPlaying(true),
        (error: unknown) => {
          if (isBenignPlayRejection(error)) {
            setIsPlaying(!el.paused)
            return
          }
          setIsPlaying(false)
        }
      )
    } else {
      el.pause()
      setIsPlaying(false)
    }
  }, [])

  return {
    isPlaying,
    volume,
    setVolume,
    togglePlay,
    currentTrack,
    currentTime,
    duration,
    seekTo,
    restartFromBeginning,
    pickNewRandomTrack,
  }
}
