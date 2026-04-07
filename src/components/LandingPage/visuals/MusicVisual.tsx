import './MusicVisual.css'

const PLAYLIST = [
  { name: 'Shadow Forest — Nightfall', active: true },
  { name: 'Flooded Plains — Rain', active: false },
  { name: 'Silent Desert — Wind', active: false },
]

export function MusicVisual() {
  return (
    <div className='MusicVisual' aria-hidden='true'>
      <div className='MusicVisual__track'>Shadow Forest — Nightfall</div>
      <div className='MusicVisual__source'>TableTopAudio · Atmospheric</div>
      <div className='MusicVisual__bar' />
      <div className='MusicVisual__controls'>
        <span>⏮</span>
        <span className='MusicVisual__controls--play'>⏸</span>
        <span>⏭</span>
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
            {active && <span>▶</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
