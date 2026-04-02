'use client'

import { useEffect, useRef } from 'react'
import { useAnimatedValue } from '@/hooks/useAnimatedValue'
import { SUITS } from '@/lib/constants/misc'
import { randomCard } from '@/lib/rng'
import { suitIsRed } from '@/lib/suitGlyphs'
import './CardDrawResult.css'

export function CardDrawResult() {
  const {
    value: card,
    isAnimating: isDrawing,
    start,
  } = useAnimatedValue(() => randomCard(Math.random))
  const startRef = useRef(start)

  useEffect(function startDrawing() {
    startRef.current()
  }, [])

  if (card === null) return null

  return (
    <span
      className={['CardDrawResult', isDrawing ? 'CardDrawResult--drawing' : '']
        .filter(Boolean)
        .join(' ')}
      aria-label={`${card.rank} ${card.suit}`}>
      <span className='CardDrawResult__card' aria-hidden='true'>
        <span className='CardDrawResult__rank'>{card.rank}</span>
        <span
          className={[
            'CardDrawResult__suit',
            suitIsRed(card.suit)
              ? 'CardDrawResult__suit--red'
              : 'CardDrawResult__suit--black',
          ].join(' ')}>
          {'\u00a0'}
          {SUITS[card.suit]}
        </span>
      </span>
    </span>
  )
}
