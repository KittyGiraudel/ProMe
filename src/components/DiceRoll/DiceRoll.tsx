import { rollD6 } from '@/lib/rng'
import { Card, Empty } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { DiceFaces } from '../DiceFaces/DiceFaces'
import { Button } from '@/components/Button/Button'
import './DiceRoll.css'
import { useLocalize } from '@/app/contexts/LocalizationContext'

export function DiceRoll() {
  const localize = useLocalize()
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
      className='DiceRoll__card home-hub__card'
      title={localize.string('tools.dieToolTitle')}
      extra={
        <Button
          onClick={handleRollDie}
          loading={isRollingDie}
          type='link'
          className='home-hub__cta'>
          {isRollingDie
            ? localize.string('tools.dieToolRolling')
            : localize.string('tools.dieToolAction')}
        </Button>
      }>
      <div
        className={[
          'DiceRoll__value',
          isRollingDie ? 'DiceRoll__value--rolling' : '',
        ]
          .filter(Boolean)
          .join(' ')}>
        {dieValue === null ? (
          <Empty description={localize.string('tools.dieToolEmpty')} />
        ) : (
          <DiceFaces values={[dieValue]} className='DiceRoll__die-face' />
        )}
      </div>
    </Card>
  )
}
