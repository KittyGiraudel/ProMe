'use client'

import { App } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { useAnimatedValue } from '@/hooks/useAnimatedValue'
import { SUITS } from '@/lib/constants/misc'
import { randomCard } from '@/lib/random/rng'
import { suitIsRed } from '@/lib/random/suitGlyphs'

import './CardDrawResult.css'

export function useCardDrawNotification() {
  const { notification } = App.useApp()
  const t = useTranslations()

  return () =>
    notification.open({
      key: 'card-draw',
      title: t('characters.tools.card_title'),
      description: <CardDrawResult />,
      placement: 'topRight',
      duration: 4,
      style: { width: 150 },
    })
}

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
