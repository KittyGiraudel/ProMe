import { useTranslations } from 'next-intl'
import { SUITS } from '@/lib/constants/misc'
import { suitIsRed } from '@/lib/suitGlyphs'
import type { PlayingCard } from '@/lib/types'
import './PlayingCardLabel.css'

type PlayingPlayingCardLabelProps = {
  card: PlayingCard
  className?: string
  /** Smaller suit glyph for inline / parenthetical use. */
  compact?: boolean
}

export function PlayingCardLabel({
  card,
  className,
  compact,
}: PlayingPlayingCardLabelProps) {
  const t = useTranslations()
  const rootClass = [
    'PlayingCardLabel',
    compact ? 'PlayingCardLabel--compact' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')
  const label = t('common.card', {
    value: t(`common.ranks.${card.rank}`),
    suit: SUITS[card.suit],
  })
  const suitClass = [
    'PlayingCardLabel__suit',
    suitIsRed(card.suit)
      ? 'PlayingCardLabel__suit--red'
      : 'PlayingCardLabel__suit--black',
  ].join(' ')

  return (
    <span className={rootClass} role='img' aria-label={label} title={label}>
      <span className='PlayingCardLabel__rank' aria-hidden='true'>
        {card.rank}
      </span>
      <span className={suitClass} aria-hidden='true'>
        {'\u00a0'}
        {SUITS[card.suit]}
      </span>
    </span>
  )
}
