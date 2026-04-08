import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined'
import { App, Card, Result, Skeleton } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import {
  SoundtrackPreloadStatus,
  useSoundtrackPreload,
} from '@/hooks/useSoundtrackPreload'
import { PossibleBiomeId } from '@/lib/types'
import { AudioPlayer } from '../AudioPlayer/AudioPlayer'
import { Button } from '../Button/Button'
import { useSettings } from '../PageSettings/SettingsContext'

const NOTIFICATION_KEY = 'audio-preload'

const useSoundtrackPreloadNotification = (
  preloadStatus: SoundtrackPreloadStatus
) => {
  const { notification } = App.useApp()
  const t = useTranslations()
  const wasLoadingRef = useRef(false)

  useEffect(() => {
    if (preloadStatus === 'loading' && !wasLoadingRef.current) {
      wasLoadingRef.current = true
      notification.open({
        key: NOTIFICATION_KEY,
        title: t('audio_player.preloading'),
        icon: <LoadingOutlined />,
        duration: 0,
        placement: 'bottomRight',
      })
    } else if (preloadStatus === 'ready' && wasLoadingRef.current) {
      wasLoadingRef.current = false
      notification.success({
        key: NOTIFICATION_KEY,
        title: t('audio_player.preload_complete'),
        description: t('audio_player.preload_complete_hint'),
        duration: 10,
        placement: 'bottomRight',
        actions: (
          <a href='#audio'>
            {t('common.actions.go_to', {
              destination: t('audio_player.title'),
            })}
          </a>
        ),
      })
    } else if (preloadStatus === 'error' && wasLoadingRef.current) {
      wasLoadingRef.current = false
      notification.destroy(NOTIFICATION_KEY)
    } else if (preloadStatus === 'idle' && wasLoadingRef.current) {
      wasLoadingRef.current = false
      notification.destroy(NOTIFICATION_KEY)
    }
  }, [preloadStatus, notification, t])
}

export function AudioCard({ biome }: { biome: PossibleBiomeId }) {
  const t = useTranslations()
  const { settings } = useSettings()
  const { status: preloadStatus, retryPreload } = useSoundtrackPreload({
    enabled: settings.sound.enabled,
    variant: settings.sound.variant,
  })

  useSoundtrackPreloadNotification(preloadStatus)

  if (!settings.sound.enabled) return null

  if (preloadStatus === 'error') {
    return (
      <Card title={t('audio_player.title')} id='audio'>
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
