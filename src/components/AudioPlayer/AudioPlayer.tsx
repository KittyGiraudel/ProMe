import PauseOutlined from '@ant-design/icons/lib/icons/PauseOutlined'
import PlayCircleOutlined from '@ant-design/icons/lib/icons/PlayCircleOutlined'
import StepBackwardOutlined from '@ant-design/icons/lib/icons/StepBackwardOutlined'
import StepForwardOutlined from '@ant-design/icons/lib/icons/StepForwardOutlined'
import { Slider, Tooltip, Typography } from 'antd'
import { Howl } from 'howler'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/Button/Button'
import { getPWADisplayMode } from '@/lib/getPWADisplayMode'
import { PossibleBiomeId } from '@/lib/types'
import { useMediaSession } from './useMediaSession'

import './AudioPlayer.css'

const FADE_DURATION_MS = 5_000

export function AudioPlayer({
  biome,
  name,
  url,
  onPrev,
  onNext,
}: {
  biome: PossibleBiomeId
  name?: string
  url: string
  onPrev?: () => void
  onNext?: () => void
}) {
  const howl = useRef<Howl | null>(null)
  const volumeRef = useRef(0.8)
  const wasPlayingRef = useRef(false)
  const [volume, setVolume] = useState(0.8)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Extracted so both the effect and togglePlay can create a Howl consistently.
  // The `wasPlayingRef` is updated via onplay/onpause so its value survives
  // effect cleanup.
  const buildHowl = useCallback((src: string) => {
    const sound = new Howl({
      src: [src],
      format: ['mp3'],
      html5: true,
      loop: true,
      volume: volumeRef.current,
      autoplay: getPWADisplayMode() === 'standalone',
      onload: () => setDuration(sound.duration()),
      onplay: () => {
        setIsPlaying(true)
        wasPlayingRef.current = true
      },
      onpause: () => {
        setIsPlaying(false)
        wasPlayingRef.current = false
      },
      // It's important not to set `isPlaying` to `false` on sound stop, because
      // this is invoked automatically when unloading the sound. So as the sound
      // fades out, Howler calls `stop`, which would turn off the player.
      // onstop: () => setIsPlaying(false),
    })
    return sound
  }, [])

  useEffect(
    function handleBiomeChange() {
      // `wasPlayingRef` survives cleanup (unlike `howl.current` which is nulled
      // there), so we can reliably know whether to auto-start the incoming track.
      const wasPlaying = wasPlayingRef.current

      // Fade out the previous sound (cleanup will unload it after the fade).
      if (howl.current) {
        howl.current.fade(volumeRef.current, 0, FADE_DURATION_MS)
      }

      // If there is no URL, stop the player and reset the state (which can happen
      // when moving into the Core cell, which has no biome and thus no audio).
      if (!url) {
        setIsPlaying(false)
        setCurrentTime(0)
        wasPlayingRef.current = false
        return
      }

      // If nothing was playing, don't construct a Howl yet — wait for the user to
      // click play. This avoids the "HTML5 Audio pool exhausted" warning firing
      // when Howler tries to obtain an audio node before any user gesture.
      if (!wasPlaying) {
        howl.current = null
        return
      }

      // Something was already playing: swap to the new track immediately.
      const sound = buildHowl(url)
      sound.play()
      howl.current = sound

      return () => {
        sound.fade(volumeRef.current, 0, FADE_DURATION_MS)
        setTimeout(() => sound.unload(), FADE_DURATION_MS)
        howl.current = null
      }
    },
    [url, buildHowl]
  )

  // Stop playback when the component unmounts (e.g. user navigates away from the
  // biome page). This covers the lazy-init path where togglePlay created the
  // Howl — that path returns no cleanup from handleBiomeChange, so without this
  // effect the audio would keep playing after navigation.
  useEffect(function cleanup() {
    return () => {
      if (howl.current) {
        howl.current.fade(volumeRef.current, 0, FADE_DURATION_MS)
        const sound = howl.current
        setTimeout(() => sound.unload(), FADE_DURATION_MS)
        howl.current = null
      }
    }
  }, [])

  // Poll current playback position while playing
  useEffect(
    function pollCurrentTime() {
      if (!isPlaying) return
      const id = setInterval(
        () => setCurrentTime(howl.current?.seek() ?? 0),
        1_000
      )
      return () => clearInterval(id)
    },
    [isPlaying]
  )

  const togglePlay = useCallback(() => {
    if (!howl.current) {
      // Howl was never created (lazy init path) — build it now on user gesture.
      if (!url) return
      const sound = buildHowl(url)
      sound.play()
      howl.current = sound
      return
    }
    if (howl.current.playing()) howl.current.pause()
    else howl.current.play()
  }, [url, buildHowl])

  const seekTo = useCallback((time: number) => {
    howl.current?.seek(time)
    setCurrentTime(time)
  }, [])

  useMediaSession({
    biome,
    trackName: name,
    isPlaying,
    currentTime,
    duration,
    onPlay: togglePlay,
    onPause: togglePlay,
    onSeekTo: seekTo,
    onPrevTrack: onPrev,
  })

  const changeVolume = useCallback((value: number) => {
    volumeRef.current = value
    setVolume(value)
    howl.current?.volume(value)
  }, [])

  return (
    <div className='AudioPlayer'>
      <div className='AudioPlayer__titleRow'>
        <Typography.Text className='AudioPlayer__trackName'>
          {name}
        </Typography.Text>
      </div>
      <div className='AudioPlayer__progressRow'>
        <span>{formatTime(currentTime)}</span>
        <Slider
          min={0}
          max={duration}
          step={1}
          value={currentTime}
          onChange={seekTo}
          tooltip={{ formatter: v => formatTime(v ?? 0) }}
          className='AudioPlayer__progress'
        />
        <span>{formatTime(duration)}</span>
      </div>
      <div className='AudioPlayer__controls'>
        <div className='AudioPlayer__controlsLeft'>
          {onPrev && (
            <Tooltip title='Previous track'>
              <Button onClick={onPrev} htmlType='button' size='small'>
                <StepBackwardOutlined />
              </Button>
            </Tooltip>
          )}
          <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
            <Button
              onClick={togglePlay}
              htmlType='button'
              size='small'
              disabled={!url}>
              {isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
            </Button>
          </Tooltip>
          {onNext && (
            <Tooltip title='Next track'>
              <Button onClick={onNext} htmlType='button' size='small'>
                <StepForwardOutlined />
              </Button>
            </Tooltip>
          )}
        </div>
        <div className='AudioPlayer__controlsRight'>
          <Slider
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={changeVolume}
            className='AudioPlayer__volumeSlider'
          />
        </div>
      </div>
    </div>
  )
}

function formatTime(timeInSeconds: number) {
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = Math.floor(timeInSeconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
