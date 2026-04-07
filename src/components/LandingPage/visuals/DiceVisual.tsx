import './DiceVisual.css'

export function DiceVisual() {
  return (
    <div className='DiceVisual' aria-hidden='true'>
      {/* CSS 3D die — front shows 4, top shows 1, left shows 5 */}
      <div className='DiceVisual__die-wrapper'>
        <div className='DiceVisual__die-scene'>
          <div className='DiceVisual__die'>
            <div className='DiceVisual__face DiceVisual__face--front'>
              <span className='DiceVisual__pip' />
              <span />
              <span className='DiceVisual__pip' />
              <span />
              <span />
              <span />
              <span className='DiceVisual__pip' />
              <span />
              <span className='DiceVisual__pip' />
            </div>
            <div className='DiceVisual__face DiceVisual__face--top'>
              <span />
              <span />
              <span />
              <span />
              <span className='DiceVisual__pip' />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className='DiceVisual__face DiceVisual__face--right' />
            <div className='DiceVisual__face DiceVisual__face--back' />
            <div className='DiceVisual__face DiceVisual__face--left'>
              <span className='DiceVisual__pip' />
              <span />
              <span className='DiceVisual__pip' />
              <span />
              <span className='DiceVisual__pip' />
              <span />
              <span className='DiceVisual__pip' />
              <span />
              <span className='DiceVisual__pip' />
            </div>
            <div className='DiceVisual__face DiceVisual__face--bottom' />
          </div>
        </div>
        <div className='DiceVisual__die-shadow' />
      </div>

      {/* Card stack */}
      <div className='DiceVisual__stack'>
        <div className='DiceVisual__card DiceVisual__card--back DiceVisual__card--back-2' />
        <div className='DiceVisual__card DiceVisual__card--back DiceVisual__card--back-1' />
        <div className='DiceVisual__card DiceVisual__card--front'>
          <span className='DiceVisual__card-corner DiceVisual__card-corner--tl'>
            Q<br />♥
          </span>
          <span className='DiceVisual__card-suit'>♥</span>
          <span className='DiceVisual__card-corner DiceVisual__card-corner--br'>
            Q<br />♥
          </span>
        </div>
      </div>
    </div>
  )
}
