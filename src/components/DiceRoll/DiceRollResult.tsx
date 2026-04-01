'use client'

import { useEffect, useRef, useState } from 'react'
import { DiceFaces } from '@/components/DiceFaces/DiceFaces'
import { rollD6 } from '@/lib/rng'
import './DiceRollResult.css'

export function DiceRollResult() {
  const [dieValue, setDieValue] = useState<number>(() => rollD6(Math.random))
  const [isRolling, setIsRolling] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDieValue(rollD6(Math.random))
    }, 90)

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setDieValue(rollD6(Math.random))
      setIsRolling(false)
    }, 1400)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <span
      className={[
        'DiceRollResult',
        isRolling ? 'DiceRollResult--rolling' : '',
      ]
        .filter(Boolean)
        .join(' ')}>
      <DiceFaces values={[dieValue]} className='DiceRollResult__die-face' />
    </span>
  )
}
