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

  // Create HTMLAudioElement once on mount
  useEffect(() => {
    const audio = new Audio()
    audio.loop = true
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  // Lazily initialize Web Audio API — must happen after user gesture
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

  // React to biome and enabled changes: fade out current and start new track
  useEffect(() => {
    if (!audioRef.current) return

    const targetBiome: BiomeId | null =
      enabled && biome !== 'unexplored' ? biome : null

    // Same biome while enabled: do nothing
    if (targetBiome === currentBiomeRef.current) return

    async function transition() {
      // Fade out current track if something is playing
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
        // Autoplay blocked — user must interact via the play button
        setIsPlaying(false)
      }
    }

    void transition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return {
    isPlaying,
    volume,
    setVolume,
    togglePlay,
    isPreloading,
    preloadError,
  }
}
