'use client'

import { useEffect, useRef } from 'react'
import { DICE } from '@/constants/misc'
import { useAnimatedValue } from '@/hooks/useAnimatedValue'
import { rollD6 } from '@/lib/random/rng'

import './DiceRollResult.css'

export function DiceRollResult() {
  const {
    value: dieValue,
    isAnimating: isRolling,
    start,
  } = useAnimatedValue(() => rollD6(Math.random))
  const startRef = useRef(start)

  useEffect(function startRolling() {
    startRef.current()
  }, [])

  if (dieValue === null) return null

  return (
    <span
      className={['DiceRollResult', isRolling ? 'DiceRollResult--rolling' : '']
        .filter(Boolean)
        .join(' ')}
      role='img'
      aria-label={String(dieValue)}>
      <span className='DiceRollResult__face'>{DICE[dieValue - 1]}</span>
    </span>
  )
}
