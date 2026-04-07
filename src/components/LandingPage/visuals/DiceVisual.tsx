import './DiceVisual.css'

export function DiceVisual() {
  return (
    <div className='DiceVisual' aria-hidden='true'>
      <div className='DiceVisual__die'>
        <span className='DiceVisual__die-value'>4</span>
      </div>
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
