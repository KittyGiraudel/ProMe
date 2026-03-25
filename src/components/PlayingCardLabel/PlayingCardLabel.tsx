import type { PlayingCard } from '@/lib/types'
import { suitIsRed } from '@/lib/suitGlyphs'
import './PlayingCardLabel.css'
import { SUITS } from '@/lib/constants/misc'
import { useTranslations } from 'next-intl'

type PlayingCardLabelProps = {
  card: PlayingCard
  className?: string
  /** Smaller suit glyph for inline / parenthetical use. */
  compact?: boolean
}

export function PlayingCardLabel({
  card,
  className,
  compact,
}: PlayingCardLabelProps) {
  const t = useTranslations()
  const rootClass = [
    'playing-card-label',
    compact ? 'playing-card-label--compact' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')
  const label = t('common.card', {
    rank: t(`ranks.${card.rank}`),
    suit: SUITS[card.suit],
  })
  const suitClass = [
    'playing-card-label__suit',
    suitIsRed(card.suit)
      ? 'playing-card-label__suit--red'
      : 'playing-card-label__suit--black',
  ].join(' ')

  return (
    <span className={rootClass} role='img' aria-label={label} title={label}>
      <span className='playing-card-label__rank' aria-hidden='true'>
        {card.rank}
      </span>
      <span className={suitClass} aria-hidden='true'>
        {'\u00a0'}
        {SUITS[card.suit]}
      </span>
    </span>
  )
}
