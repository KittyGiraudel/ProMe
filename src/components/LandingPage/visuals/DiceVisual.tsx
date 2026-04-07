import './DiceVisual.css'

export function DiceVisual() {
  return (
    <div className='DiceVisual' aria-hidden='true'>
      {/* D6 face 4 — pips at all four corners */}
      <div className='DiceVisual__die'>
        <span className='DiceVisual__pip' />
        <span className='DiceVisual__pip' />
        <span className='DiceVisual__pip' />
        <span className='DiceVisual__pip' />
      </div>
      {/* Queen of Hearts */}
      <div className='DiceVisual__card'>
        <span className='DiceVisual__card-corner DiceVisual__card-corner--tl'>
          Q<br />♥
        </span>
        <span className='DiceVisual__card-suit'>♥</span>
        <span className='DiceVisual__card-corner DiceVisual__card-corner--br'>
          Q<br />♥
        </span>
      </div>
    </div>
  )
}
