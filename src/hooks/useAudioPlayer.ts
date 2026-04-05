'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSoundtrackPreload } from '@/hooks/useSoundtrackPreload'
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
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const currentBiomeRef = useRef<BiomeId | null>(null)
  const volumeRef = useRef(0.8)
  const isFadingRef = useRef(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.8)
  const [currentTrack, setCurrentTrack] = useState<TrackEntry | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Create HTMLAudioElement once on mount; attach time/duration listeners
  useEffect(() => {
    const audio = new Audio()
    audio.loop = true
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
      audio.pause()
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audioRef.current = null
      void audioContextRef.current?.close()
      audioContextRef.current = null
    }
  }, [])

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
      if (!ctx || !gain) return resolve()
      isFadingRef.current = true
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + FADE_DURATION_MS / 1000
      )
      setTimeout(() => {
        isFadingRef.current = false
        resolve()
      }, FADE_DURATION_MS + 100)
    })
  }

  function resetGain() {
    isFadingRef.current = false
    const ctx = audioContextRef.current
    const gain = gainNodeRef.current
    if (!ctx || !gain) return
    gain.gain.cancelScheduledValues(ctx.currentTime)
    gain.gain.setValueAtTime(volumeRef.current, ctx.currentTime)
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

      getAudioContext()
      resetGain()

      try {
        await audioRef.current.play()
        if (!cancelled) setIsPlaying(true)
      } catch {
        // Autoplay blocked — user must interact via the play button
        if (!cancelled) setIsPlaying(false)
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
    if (
      gainNodeRef.current &&
      audioContextRef.current &&
      !isFadingRef.current
    ) {
      gainNodeRef.current.gain.setValueAtTime(
        v,
        audioContextRef.current.currentTime
      )
    }
    if (audioRef.current) {
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

      getAudioContext()
      resetGain()

      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch {
        setIsPlaying(false)
      }
    }

    void run()
  }, [variant])

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
