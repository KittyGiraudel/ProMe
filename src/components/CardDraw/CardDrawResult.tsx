'use client'

import { useEffect, useRef, useState } from 'react'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import { randomCard } from '@/lib/rng'
import type { PlayingCard } from '@/lib/types'
import './CardDrawResult.css'

export function CardDrawResult() {
  const [card, setCard] = useState<PlayingCard>(() => randomCard(Math.random))
  const [isDrawing, setIsDrawing] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCard(randomCard(Math.random))
    }, 90)

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setCard(randomCard(Math.random))
      setIsDrawing(false)
    }, 1400)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <span
      className={[
        'CardDrawResult',
        isDrawing ? 'CardDrawResult--drawing' : '',
      ]
        .filter(Boolean)
        .join(' ')}>
      <PlayingCardLabel card={card} className='CardDrawResult__card' />
    </span>
  )
}
