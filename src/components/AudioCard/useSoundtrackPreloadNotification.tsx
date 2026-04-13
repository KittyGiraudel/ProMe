import { LoadingOutlined } from '@ant-design/icons'
import { App } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { SoundtrackPreloadStatus } from '@/hooks/useSoundtrackPreload'
import { getPWADisplayMode } from '@/lib/getPWADisplayMode'

const NOTIFICATION_KEY = 'audio-preload'

export const useSoundtrackPreloadNotification = (
  preloadStatus: SoundtrackPreloadStatus
) => {
  const { notification } = App.useApp()
  const t = useTranslations()
  const wasLoadingRef = useRef(false)

  useEffect(
    function handlePreloadStatusChange() {
      if (preloadStatus === 'loading' && !wasLoadingRef.current) {
        wasLoadingRef.current = true
        notification.open({
          key: NOTIFICATION_KEY,
          title: t('audio_player.preloading'),
          icon: <LoadingOutlined />,
          duration: 0,
          placement: 'topRight',
        })
      } else if (preloadStatus === 'ready' && wasLoadingRef.current) {
        wasLoadingRef.current = false
        notification.success({
          key: NOTIFICATION_KEY,
          title: t('audio_player.preload_complete'),
          description:
            getPWADisplayMode() === 'standalone'
              ? undefined
              : t('audio_player.preload_complete_hint'),
          duration: 10,
          placement: 'topRight',
          actions: (
            <a
              href='#audio'
              onClick={() => notification.destroy(NOTIFICATION_KEY)}>
              {t('common.actions.go_to', {
                destination: t('audio_player.title'),
              })}
            </a>
          ),
        })
      } else if (preloadStatus === 'idle' && wasLoadingRef.current) {
        wasLoadingRef.current = false
        notification.destroy(NOTIFICATION_KEY)
      }
    },
    [preloadStatus, notification, t]
  )
}
