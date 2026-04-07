import './DiceVisual.css'

export function DiceVisual() {
  return (
    <div className='DiceVisual' aria-hidden='true'>
      <div className='DiceVisual__die'>4</div>
      <div className='DiceVisual__die DiceVisual__die--featured'>17</div>
      <div className='DiceVisual__die'>12</div>
      <div className='DiceVisual__card'>🃏</div>
    </div>
  )
}
