import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined'
import WarningOutlined from '@ant-design/icons/lib/icons/WarningOutlined'
import { App, Card, Result } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { useSoundtrackPreload } from '@/hooks/useSoundtrackPreload'
import { PossibleBiomeId } from '@/lib/types'
import { AudioPlayer } from '../AudioPlayer/AudioPlayer'
import { Button } from '../Button/Button'
import { LoadingState } from '../LoadingState/LoadingState'
import { useSettings } from '../PageSettings/SettingsContext'
import { Spacing } from '../Spacing/Spacing'

export function AudioCard({ biome }: { biome: PossibleBiomeId }) {
  const t = useTranslations()
  const { notification } = App.useApp()
  const { settings } = useSettings()
  const { isPreloading, preloadError, retryPreload } = useSoundtrackPreload({
    enabled: settings.sound.enabled,
    variant: settings.sound.variant,
  })

  const wasPreloadingRef = useRef(false)

  useEffect(() => {
    if (isPreloading && !wasPreloadingRef.current) {
      wasPreloadingRef.current = true
      notification.info({
        key: 'audio-preload',
        title: t('audio_player.preloading'),
        icon: <LoadingOutlined />,
        duration: 0,
        placement: 'bottomRight',
      })
    } else if (!isPreloading && wasPreloadingRef.current) {
      wasPreloadingRef.current = false
      notification.success({
        key: 'audio-preload',
        title: t('audio_player.preload_complete'),
        duration: 3,
        placement: 'bottomRight',
      })
    }
  }, [isPreloading, notification, t])

  if (!settings.sound.enabled) return null

  if (preloadError) {
    return (
      <Card title={t('audio_player.title')}>
        <Result
          status='error'
          title={t('audio_player.error')}
          extra={
            <Button type='default' onClick={retryPreload}>
              {t('audio_player.retry')}
            </Button>
          }
        />
      </Card>
    )
  }

  if (isPreloading) {
    return (
      <Card title={t('audio_player.title')}>
        <LoadingState description={t('audio_player.preloading')} />
      </Card>
    )
  }

  return (
    <Card title={t('audio_player.title')}>
      <AudioPlayer biome={biome} />
    </Card>
  )
}
