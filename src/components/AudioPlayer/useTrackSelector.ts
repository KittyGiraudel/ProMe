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
