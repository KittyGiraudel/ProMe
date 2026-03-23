import { rollD6 } from '@/lib/rng'
import { copy } from '@/messages/fr'
import { Button, Card } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { DiceFaces } from '../DiceFaces/DiceFaces'
import './DiceRoll.css'

export function DiceRoll() {
  const [dieValue, setDieValue] = useState<number | null>(null)
  const [isRollingDie, setIsRollingDie] = useState(false)
  const dieRollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dieRollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (dieRollIntervalRef.current) {
        clearInterval(dieRollIntervalRef.current)
      }
      if (dieRollTimeoutRef.current) {
        clearTimeout(dieRollTimeoutRef.current)
      }
    }
  }, [])

  const handleRollDie = () => {
    if (isRollingDie) {
      return
    }
    setIsRollingDie(true)
    setDieValue(rollD6(Math.random))

    dieRollIntervalRef.current = setInterval(() => {
      setDieValue(rollD6(Math.random))
    }, 90)

    dieRollTimeoutRef.current = setTimeout(() => {
      if (dieRollIntervalRef.current) {
        clearInterval(dieRollIntervalRef.current)
        dieRollIntervalRef.current = null
      }
      setDieValue(rollD6(Math.random))
      setIsRollingDie(false)
      dieRollTimeoutRef.current = null
    }, 1400)
  }

  return (
    <Card
      hoverable
      className='DiceRoll__card home-hub__card'
      title={copy.hub.dieToolTitle}
      extra={
        <Button
          onClick={handleRollDie}
          loading={isRollingDie}
          type='link'
          className='home-hub__cta'>
          {isRollingDie ? copy.hub.dieToolRolling : copy.hub.dieToolAction}
        </Button>
      }>
      <p
        className={[
          'DiceRoll__value',
          isRollingDie ? 'DiceRoll__value--rolling' : '',
        ]
          .filter(Boolean)
          .join(' ')}>
        {dieValue === null ? (
          copy.hub.dieToolEmpty
        ) : (
          <DiceFaces values={[dieValue]} className='DiceRoll__die-face' />
        )}
      </p>
    </Card>
  )
}
