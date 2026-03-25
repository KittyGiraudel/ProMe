import { DICE } from '@/lib/constants/misc'
import { useLocalize } from '@/app/contexts/LocalizationContext'
import { Localize } from '@/lib/localization/localize'
import './DiceFaces.css'

function defaultDiceFacesLabel(
  values: readonly number[],
  localize: Localize
): string {
  if (values.length === 0) return ''
  if (values.length === 1) {
    return localize.string('common.die', { value: values[0]! })
  }

  const last = values.at(-1)!
  const rest = values.slice(0, -1)

  return localize.string('common.collection', rest.join(', '), last)
}

export type DiceFacesProps = {
  values: readonly number[]
  /** Overrides the default label built from `values`. */
  ariaLabel?: string
  className?: string
}

export function DiceFaces({ values, ariaLabel, className }: DiceFacesProps) {
  const localize = useLocalize()
  const rootClass = ['dice-faces', className].filter(Boolean).join(' ')

  const announcedLabel =
    ariaLabel !== undefined
      ? ariaLabel
      : values.length > 0
        ? defaultDiceFacesLabel(values, localize)
        : ''

  return (
    <span
      className={rootClass}
      role={announcedLabel ? 'img' : undefined}
      aria-label={announcedLabel}>
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
    return DICE[value - 1]!
  }

  return String(value)
}
