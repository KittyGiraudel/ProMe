'use client'

import {
  PauseOutlined,
  PlayCircleOutlined,
  RetweetOutlined,
  SoundOutlined,
  StepBackwardOutlined,
} from '@ant-design/icons'
import { Button, Slider, Space, Tooltip, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import type { PossibleBiomeId } from '@/lib/types'

import './AudioPlayer.css'

function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return '0:00'
  }
  const s = Math.floor(totalSeconds % 60)
  const m = Math.floor(totalSeconds / 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function AudioPlayer({ biome }: { biome: PossibleBiomeId }) {
  const { settings } = useSettings()
  const t = useTranslations()

  const {
    isPlaying,
    volume,
    setVolume,
    togglePlay,
    currentTrack,
    currentTime,
    duration,
    seekTo,
    restartFromBeginning,
    pickNewRandomTrack,
  } = useAudioPlayer({
    biome,
    enabled: settings.sound.enabled,
    variant: settings.sound.variant,
  })

  const hasTrack = currentTrack !== null
  const canSeek = hasTrack && Number.isFinite(duration) && duration > 0
  const progressMax = canSeek ? duration : 1

  return (
    <div className='AudioPlayer'>
      <div className='AudioPlayer__controls'>
        <div className='AudioPlayer__controlsLeft'>
          <Tooltip
            title={
              isPlaying ? t('audio_player.pause') : t('audio_player.play')
            }>
            <Button
              type='primary'
              shape='circle'
              size='small'
              icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
              onClick={togglePlay}
              disabled={!hasTrack}
              aria-label={
                isPlaying ? t('audio_player.pause') : t('audio_player.play')
              }
            />
          </Tooltip>
          <Tooltip title={t('audio_player.restart_track')}>
            <Button
              type='default'
              size='small'
              icon={<StepBackwardOutlined />}
              onClick={restartFromBeginning}
              disabled={!hasTrack}
              aria-label={t('audio_player.restart_track')}
            />
          </Tooltip>
          <Tooltip title={t('audio_player.new_track')}>
            <Button
              type='default'
              size='small'
              icon={<RetweetOutlined />}
              onClick={pickNewRandomTrack}
              disabled={!hasTrack}
              aria-label={t('audio_player.new_track')}
            />
          </Tooltip>
        </div>

        <Typography.Text
          className='AudioPlayer__trackName'
          ellipsis={{ tooltip: currentTrack?.name }}
          type='secondary'>
          {currentTrack?.name ?? t('audio_player.idle')}
        </Typography.Text>

        <Space className='AudioPlayer__volume' align='center'>
          <SoundOutlined className='AudioPlayer__volumeIcon' />
          <Slider
            className='AudioPlayer__volumeSlider'
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={setVolume}
            tooltip={{ formatter: v => `${Math.round((v ?? 0) * 100)}%` }}
            aria-label={t('audio_player.volume')}
          />
        </Space>
      </div>
      <div className='AudioPlayer__progressRow'>
        <span className='AudioPlayer__time'>{formatTime(currentTime)}</span>
        <Slider
          className='AudioPlayer__progress'
          min={0}
          max={progressMax}
          step={0.1}
          value={canSeek ? Math.min(currentTime, duration) : 0}
          onChange={seekTo}
          disabled={!canSeek}
          tooltip={{
            formatter: v => (v === undefined ? '' : formatTime(v)),
          }}
          aria-label={t('audio_player.progress_label')}
        />
        <span className='AudioPlayer__time'>{formatTime(duration)}</span>
      </div>
    </div>
  )
}
