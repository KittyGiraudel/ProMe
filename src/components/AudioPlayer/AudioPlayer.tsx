'use client'

import {
  LoadingOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  SoundOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { App, Button, Slider, Space, Spin, Tooltip } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import type { BiomeId } from '@/lib/types'
import './AudioPlayer.css'

export function AudioPlayer({ biome }: { biome: BiomeId | 'unexplored' }) {
  const { settings } = useSettings()
  const t = useTranslations()
  const { notification } = App.useApp()

  const {
    isPlaying,
    volume,
    setVolume,
    togglePlay,
    isPreloading,
    preloadError,
  } = useAudioPlayer({
    biome,
    enabled: settings.sound.enabled,
    variant: settings.sound.variant,
  })

  const wasPreloadingRef = useRef(false)

  useEffect(() => {
    if (isPreloading && !wasPreloadingRef.current) {
      wasPreloadingRef.current = true
      notification.info({
        key: 'audio-preload',
        message: t('audio_player.preloading'),
        icon: <LoadingOutlined />,
        duration: 0,
        placement: 'bottomLeft',
      })
    } else if (!isPreloading && wasPreloadingRef.current) {
      wasPreloadingRef.current = false
      notification.success({
        key: 'audio-preload',
        message: t('audio_player.preload_complete'),
        duration: 3,
        placement: 'bottomLeft',
      })
    }
  }, [isPreloading, notification, t])

  if (!settings.sound.enabled) return null

  return (
    <div className='AudioPlayer'>
      {isPreloading ? (
        <Spin indicator={<LoadingOutlined />} size='small' />
      ) : (
        <Tooltip
          title={isPlaying ? t('audio_player.pause') : t('audio_player.play')}>
          <Button
            type='text'
            size='small'
            icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
            onClick={togglePlay}
          />
        </Tooltip>
      )}

      {preloadError ? (
        <span className='AudioPlayer-error'>
          <WarningOutlined /> {t('audio_player.error')}
        </span>
      ) : null}

      {!preloadError ? (
        <Space className='AudioPlayer-volume' align='center'>
          <SoundOutlined style={{ fontSize: 12 }} />
          <Slider
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={setVolume}
            style={{ width: 80 }}
            tooltip={{ formatter: v => `${Math.round((v ?? 0) * 100)}%` }}
          />
        </Space>
      ) : null}
    </div>
  )
}
