import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined'
import { App, Card, Result } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { useSoundtrackPreload } from '@/hooks/useSoundtrackPreload'
import { PossibleBiomeId } from '@/lib/types'
import { AudioPlayer } from '../AudioPlayer/AudioPlayer'
import { Button } from '../Button/Button'
import { LoadingState } from '../LoadingState/LoadingState'
import { useSettings } from '../PageSettings/SettingsContext'

export function AudioCard({ biome }: { biome: PossibleBiomeId }) {
  const t = useTranslations()
  const { notification } = App.useApp()
  const { settings } = useSettings()
  const { status: preloadStatus, retryPreload } = useSoundtrackPreload({
    enabled: settings.sound.enabled,
    variant: settings.sound.variant,
  })

  const wasLoadingRef = useRef(false)

  useEffect(() => {
    if (preloadStatus === 'loading' && !wasLoadingRef.current) {
      wasLoadingRef.current = true
      notification.info({
        key: 'audio-preload',
        title: t('audio_player.preloading'),
        icon: <LoadingOutlined />,
        duration: 0,
        placement: 'bottomRight',
      })
    } else if (preloadStatus === 'ready' && wasLoadingRef.current) {
      wasLoadingRef.current = false
      notification.success({
        key: 'audio-preload',
        title: t('audio_player.preload_complete'),
        duration: 3,
        placement: 'bottomRight',
      })
    } else if (preloadStatus === 'error' && wasLoadingRef.current) {
      wasLoadingRef.current = false
      notification.destroy('audio-preload')
    } else if (preloadStatus === 'idle' && wasLoadingRef.current) {
      wasLoadingRef.current = false
      notification.destroy('audio-preload')
    }
  }, [preloadStatus, notification, t])

  if (!settings.sound.enabled) return null

  if (preloadStatus === 'error') {
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

  if (preloadStatus === 'loading') {
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
