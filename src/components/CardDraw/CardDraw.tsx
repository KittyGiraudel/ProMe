'use client'

import { Card, Empty } from 'antd'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import { useAnimatedValue } from '@/hooks/useAnimatedValue'
import { useModifierKey } from '@/hooks/useModifierKey'
import { randomCard } from '@/lib/random/rng'

import './CardDraw.css'

export function CardDraw() {
  const { settings } = useSettings()
  const modifier = useModifierKey()
  const t = useTranslations()
  const {
    value: drawnCard,
    isAnimating: isDrawingCard,
    start: handleDrawCard,
  } = useAnimatedValue(() => randomCard(Math.random))

  return (
    <Card
      className='CardDraw__card'
      title={t('characters.tools.card_title')}
      actions={[
        <Button
          key='action'
          onClick={handleDrawCard}
          loading={isDrawingCard}
          type='link'
          disabled={false}>
          {isDrawingCard
            ? t('characters.tools.card_drawing')
            : t('characters.tools.card_action')}
        </Button>,
      ]}>
      <div
        className={[
          'CardDraw__value',
          isDrawingCard ? 'CardDraw__value--drawing' : '',
        ]
          .filter(Boolean)
          .join(' ')}>
        {drawnCard === null ? (
          <Empty
            description={
              settings.shortcuts.enabled
                ? t('characters.tools.card_tooltip', { modifier })
                : t('characters.tools.card_empty')
            }
          />
        ) : (
          <PlayingCardLabel card={drawnCard} className='CardDraw__drawn-card' />
        )}
      </div>
    </Card>
  )
}
