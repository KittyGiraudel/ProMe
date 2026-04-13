import { useMemo } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { getTrackPath, pickRandomTrack } from '@/lib/sounds/catalog'
import { PossibleBiomeId } from '@/lib/types'

export const useBiomeTrack = (biome: PossibleBiomeId) => {
  const { settings } = useSettings()
  const track = useMemo(
    () => (biome !== 'unexplored' ? pickRandomTrack(biome) : null),
    [biome]
  )
  const url = useMemo(
    () => (track ? getTrackPath(track, settings.sound.variant) : null),
    [track, settings.sound.variant]
  )
  return { name: track?.name, url }
}
