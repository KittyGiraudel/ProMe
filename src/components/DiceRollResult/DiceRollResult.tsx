'use client'

import { App } from 'antd'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { useAnimatedValue } from '@/hooks/useAnimatedValue'
import { DICE } from '@/lib/constants/misc'
import { rollD6 } from '@/lib/random/rng'

import './DiceRollResult.css'

export function useDiceRollNotification() {
  const { notification } = App.useApp()
  const t = useTranslations()

  return () =>
    notification.open({
      key: 'dice-roll',
      title: t('characters.tools.die_title'),
      description: <DiceRollResult />,
      placement: 'bottomLeft',
      duration: 4,
      style: { width: 150 },
    })
}

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
      <span className='DiceRollResult__face' aria-hidden='true'>
        {DICE[dieValue - 1]}
      </span>
    </span>
  )
}
