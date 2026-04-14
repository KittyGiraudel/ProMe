import { useMemo } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import {
  getTrackPath,
  getTracksForBiome,
  pickRandomTrack,
} from '@/lib/sounds/catalog'
import { PossibleBiomeId } from '@/lib/types'

export const useBiomeTrack = (
  biome: PossibleBiomeId,
  pick: '1' | '2' | 'random'
) => {
  const { settings } = useSettings()

  const track = useMemo(() => {
    if (biome === 'unexplored') return null
    const tracks = getTracksForBiome(biome)
    if (pick === '1') return tracks[0]
    if (pick === '2') return tracks[1]
    return pickRandomTrack(biome)
  }, [biome, pick])

  const url = useMemo(
    () => (track ? getTrackPath(track, settings.sound.variant) : null),
    [track, settings.sound.variant]
  )
  return { name: track?.name, url }
}
