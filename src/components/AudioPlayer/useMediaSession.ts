import { useEffect } from 'react'
import { PossibleBiomeId } from '@/lib/types'

const BIOMES_WITH_BANNER: PossibleBiomeId[] = [
  'shadowForest',
  'floodedPlains',
  'fieldSea',
  'silentDesert',
  'mushroomJungle',
]

function getArtwork(biome: PossibleBiomeId): MediaImage[] {
  if (!BIOMES_WITH_BANNER.includes(biome)) return []
  return [{ src: `/images/banner-${biome}.avif`, type: 'image/avif' }]
}

type Props = {
  biome: PossibleBiomeId
  trackName: string | undefined
  isPlaying: boolean
  currentTime: number
  duration: number
  onPlay: () => void
  onPause: () => void
  onSeekTo: (time: number) => void
}

export function useMediaSession({
  biome,
  trackName,
  isPlaying,
  currentTime,
  duration,
  onPlay,
  onPause,
  onSeekTo,
}: Props) {
  useEffect(
    function setMetadata() {
      if (!('mediaSession' in navigator)) return
      navigator.mediaSession.metadata = trackName
        ? new MediaMetadata({
            title: trackName,
            artist: 'ProMe',
            artwork: getArtwork(biome),
          })
        : null
    },
    [biome, trackName]
  )

  useEffect(
    function setActionHandlers() {
      if (!('mediaSession' in navigator)) return
      navigator.mediaSession.setActionHandler('play', onPlay)
      navigator.mediaSession.setActionHandler('pause', onPause)
      navigator.mediaSession.setActionHandler('seekto', details => {
        if (details.seekTime != null) onSeekTo(details.seekTime)
      })
      navigator.mediaSession.setActionHandler('seekbackward', details => {
        onSeekTo(Math.max(0, currentTime - (details.seekOffset ?? 10)))
      })
      navigator.mediaSession.setActionHandler('seekforward', details => {
        onSeekTo(Math.min(duration, currentTime + (details.seekOffset ?? 10)))
      })
      navigator.mediaSession.setActionHandler('previoustrack', () =>
        onSeekTo(0)
      )
    },
    [onPlay, onPause, onSeekTo, currentTime, duration]
  )

  useEffect(
    function syncPlaybackState() {
      if (!('mediaSession' in navigator)) return
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'
    },
    [isPlaying]
  )

  useEffect(
    function syncPositionState() {
      if (!('mediaSession' in navigator)) return
      if (duration <= 0) return
      try {
        navigator.mediaSession.setPositionState({
          duration,
          position: Math.min(currentTime, duration),
          playbackRate: 1,
        })
      } catch {
        // setPositionState can throw if position > duration due to timing
      }
    },
    [currentTime, duration]
  )
}
