import type { PlayingCard } from '@/lib/lsdp/types'
import { suitGlyph, suitIsRed } from '@/lib/lsdp/suitGlyphs'
import { formatPlayingCard, fr } from '@/messages/fr'
import './PlayingCardLabel.css'

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
  const rootClass = [
    'playing-card-label',
    compact ? 'playing-card-label--compact' : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')
  const ariaLabel = formatPlayingCard(card.suit, card.rank)
  const rankText = fr.ranks[card.rank]
  const suitClass = [
    'playing-card-label__suit',
    suitIsRed(card.suit)
      ? 'playing-card-label__suit--red'
      : 'playing-card-label__suit--black',
  ].join(' ')

  return (
    <span className={rootClass} role='img' aria-label={ariaLabel}>
      <span className='playing-card-label__rank' aria-hidden>
        {rankText}
      </span>
      <span className={suitClass} aria-hidden>
        {'\u00a0'}
        {suitGlyph(card.suit)}
      </span>
    </span>
  )
}
