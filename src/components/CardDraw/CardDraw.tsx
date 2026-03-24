import { randomCard } from '@/lib/rng'
import { copy } from '@/messages/fr'
import { Card, Empty } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { PlayingCardLabel } from '../PlayingCardLabel/PlayingCardLabel'
import { PlayingCard } from '@/lib/types'
import { Button } from '@/components/Button/Button'
import './CardDraw.css'

export function CardDraw() {
  const [drawnCard, setDrawnCard] = useState<PlayingCard | null>(null)
  const [isDrawingCard, setIsDrawingCard] = useState(false)
  const cardDrawIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  )
  const cardDrawTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (cardDrawIntervalRef.current) {
        clearInterval(cardDrawIntervalRef.current)
      }
      if (cardDrawTimeoutRef.current) {
        clearTimeout(cardDrawTimeoutRef.current)
      }
    }
  }, [])

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
    <Card
      className='CardDraw__card home-hub__card'
      title={copy.hub.cardToolTitle}
      extra={
        <Button
          onClick={handleDrawCard}
          loading={isDrawingCard}
          type='link'
          className='home-hub__cta'>
          {isDrawingCard ? copy.hub.cardToolDrawing : copy.hub.cardToolAction}
        </Button>
      }>
      <div
        className={[
          'CardDraw__value',
          isDrawingCard ? 'CardDraw__value--drawing' : '',
        ]
          .filter(Boolean)
          .join(' ')}>
        {drawnCard === null ? (
          <Empty description={copy.hub.cardToolEmpty} />
        ) : (
          <PlayingCardLabel card={drawnCard} className='CardDraw__drawn-card' />
        )}
      </div>
    </Card>
  )
}
