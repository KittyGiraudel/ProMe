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
      <Card title={<h2>{t('audio_player.title')}</h2>} id='audio'>
        <Skeleton active />
      </Card>
    )
  }

  if (!url) return null

  return (
    <Card title={<h2>{t('audio_player.title')}</h2>} id='audio'>
      <AudioPlayer
        biome={biome}
        name={name}
        url={url}
        onPrev={goToPrev}
        onNext={goToNext}
      />
    </Card>
  )
}
