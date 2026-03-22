import { copy } from '@/messages/fr'
import './DiceFaces.css'

function defaultDiceFacesAriaLabel(values: readonly number[]): string {
  if (values.length === 0) {
    return ''
  }
  if (values.length === 1) {
    return copy.a11y.dieSingle(values[0]!)
  }
  const last = values.at(-1)!
  const rest = values.slice(0, -1)
  return copy.a11y.diceList(rest.join(', '), last)
}

export type DiceFacesProps = {
  values: readonly number[]
  /** Overrides the default label built from `values`. */
  ariaLabel?: string
  className?: string
}

export function DiceFaces({ values, ariaLabel, className }: DiceFacesProps) {
  const rootClass = ['dice-faces', className].filter(Boolean).join(' ')

  const announcedLabel =
    ariaLabel !== undefined
      ? ariaLabel
      : values.length > 0
        ? defaultDiceFacesAriaLabel(values)
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

function diceFaceGlyph(value: number): string {
  if (value >= 1 && value <= 6) {
    return ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][value - 1]!
  }

  return String(value)
}
