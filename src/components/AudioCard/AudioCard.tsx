import { Card, Skeleton } from 'antd'
import { useTranslations } from 'next-intl'
import { AudioPlayer } from '@/components/AudioPlayer/AudioPlayer'
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

  useSoundtrackPreloadNotification(preloadStatus)

  if (!settings.sound.enabled) return null

  if (preloadStatus === 'loading') {
    return (
      <Card title={t('audio_player.title')} id='audio'>
        <Skeleton active />
      </Card>
    )
  }

  return (
    <Card title={t('audio_player.title')} id='audio'>
      <AudioPlayer biome={biome} />
    </Card>
  )
}
