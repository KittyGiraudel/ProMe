import { diceFaceGlyph } from '@/lib/lsdp/diceGlyphs'
import './DiceFaces.css'

function defaultDiceFacesAriaLabel(
  values: readonly number[],
  locale: 'fr' | 'en'
): string {
  if (values.length === 0) {
    return ''
  }
  if (locale === 'en') {
    if (values.length === 1) {
      return `Die ${values[0]}`
    }
    const last = values.at(-1)!
    const rest = values.slice(0, -1)
    return `Dice ${rest.join(', ')} and ${last}`
  }
  if (values.length === 1) {
    return `Dé ${values[0]}`
  }
  const last = values.at(-1)!
  const rest = values.slice(0, -1)
  return `Dés ${rest.join(', ')} et ${last}`
}

export type DiceFacesProps = {
  values: readonly number[]
  /** Overrides the default label built from `values`. */
  ariaLabel?: string
  /** Locale for the default label when `ariaLabel` is omitted. Default `fr`. */
  locale?: 'fr' | 'en'
  className?: string
}

export function DiceFaces({
  values,
  ariaLabel,
  locale = 'fr',
  className,
}: DiceFacesProps) {
  const rootClass = ['dice-faces', className].filter(Boolean).join(' ')

  const announcedLabel =
    ariaLabel !== undefined
      ? ariaLabel
      : values.length > 0
        ? defaultDiceFacesAriaLabel(values, locale)
        : ''

  return (
    <span
      className={rootClass}
      role={announcedLabel ? 'img' : undefined}
      aria-label={announcedLabel || undefined}>
      {values.map((v, i) => (
        <span
          key={i}
          className='dice-faces__face'
          aria-hidden={!!announcedLabel}>
          {diceFaceGlyph(v)}
        </span>
      ))}
    </span>
  )
}
