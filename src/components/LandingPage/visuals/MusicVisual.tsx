import FastBackwardOutlined from '@ant-design/icons/lib/icons/FastBackwardOutlined'
import FastForwardOutlined from '@ant-design/icons/lib/icons/FastForwardOutlined'
import PauseOutlined from '@ant-design/icons/lib/icons/PauseOutlined'
import PlayCircleOutlined from '@ant-design/icons/lib/icons/PlayCircleOutlined'
import { useTranslations } from 'next-intl'

import './MusicVisual.css'

export function MusicVisual() {
  const t = useTranslations()
  const PLAYLIST = [
    { name: t('landing.features.music.demo.track_1'), active: true },
    { name: t('landing.features.music.demo.track_2'), active: false },
    { name: t('landing.features.music.demo.track_3'), active: false },
  ]
  return (
    <div className='MusicVisual' aria-hidden='true'>
      <div className='MusicVisual__track'>
        {t('landing.features.music.demo.track_1')}
      </div>
      <div className='MusicVisual__source'>
        {t('landing.features.music.demo.source')}
      </div>
      <div className='MusicVisual__bar' />
      <div className='MusicVisual__controls'>
        <span>
          <FastBackwardOutlined />
        </span>
        <span className='MusicVisual__controls--play'>
          <PauseOutlined />
        </span>
        <span>
          <FastForwardOutlined />
        </span>
      </div>
      <div className='MusicVisual__playlist'>
        {PLAYLIST.map(({ name, active }) => (
          <div
            key={name}
            className={[
              'MusicVisual__playlist-item',
              active ? 'MusicVisual__playlist-item--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}>
            <span>{name}</span>
            {active && (
              <span>
                <PlayCircleOutlined />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
