'use client'

import { Button, Card } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { DiceFaces } from '@/components/DiceFaces/DiceFaces'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import { randomCard, rollD6 } from '@/lib/rng'
import type { PlayingCard } from '@/lib/types'
import { copy } from '@/messages/fr'
import './HomeQuickTools.css'

export function HomeQuickTools() {
  const [dieValue, setDieValue] = useState<number | null>(null)
  const [drawnCard, setDrawnCard] = useState<PlayingCard | null>(null)
  const [isRollingDie, setIsRollingDie] = useState(false)
  const [isDrawingCard, setIsDrawingCard] = useState(false)
  const dieRollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dieRollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cardDrawIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  )
  const cardDrawTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (dieRollIntervalRef.current) {
        clearInterval(dieRollIntervalRef.current)
      }
      if (dieRollTimeoutRef.current) {
        clearTimeout(dieRollTimeoutRef.current)
      }
      if (cardDrawIntervalRef.current) {
        clearInterval(cardDrawIntervalRef.current)
      }
      if (cardDrawTimeoutRef.current) {
        clearTimeout(cardDrawTimeoutRef.current)
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

  const handleDrawCard = () => {
    if (isDrawingCard) {
      return
    }
    setIsDrawingCard(true)
    setDrawnCard(randomCard(Math.random))

    cardDrawIntervalRef.current = setInterval(() => {
      setDrawnCard(randomCard(Math.random))
    }, 90)

    cardDrawTimeoutRef.current = setTimeout(() => {
      if (cardDrawIntervalRef.current) {
        clearInterval(cardDrawIntervalRef.current)
        cardDrawIntervalRef.current = null
      }
      setDrawnCard(randomCard(Math.random))
      setIsDrawingCard(false)
      cardDrawTimeoutRef.current = null
    }, 1400)
  }

  return (
    <section className='home-quick-tools' aria-label={copy.hub.quickToolsTitle}>
      <h2 className='home-quick-tools__title'>{copy.hub.quickToolsTitle}</h2>
      <div className='home-quick-tools__grid'>
        <Card
          size='small'
          className='home-quick-tools__tool-card home-quick-tools__tool-card--die'
          title={copy.hub.dieToolTitle}>
          <p
            className={[
              'home-quick-tools__tool-value',
              'home-quick-tools__tool-value--die',
              isRollingDie ? 'home-quick-tools__tool-value--rolling' : '',
            ]
              .filter(Boolean)
              .join(' ')}>
            {dieValue === null ? (
              copy.hub.dieToolEmpty
            ) : (
              <DiceFaces
                values={[dieValue]}
                className='home-quick-tools__die-face'
              />
            )}
          </p>
          <Button onClick={handleRollDie} loading={isRollingDie}>
            {isRollingDie ? copy.hub.dieToolRolling : copy.hub.dieToolAction}
          </Button>
        </Card>
        <Card
          size='small'
          className='home-quick-tools__tool-card home-quick-tools__tool-card--card'
          title={copy.hub.cardToolTitle}>
          <p
            className={[
              'home-quick-tools__tool-value',
              'home-quick-tools__tool-value--card',
              isDrawingCard ? 'home-quick-tools__tool-value--drawing' : '',
            ]
              .filter(Boolean)
              .join(' ')}>
            {drawnCard === null ? (
              copy.hub.cardToolEmpty
            ) : (
              <PlayingCardLabel
                card={drawnCard}
                className='home-quick-tools__drawn-card'
              />
            )}
          </p>
          <Button onClick={handleDrawCard} loading={isDrawingCard}>
            {isDrawingCard ? copy.hub.cardToolDrawing : copy.hub.cardToolAction}
          </Button>
        </Card>
      </div>
    </section>
  )
}
