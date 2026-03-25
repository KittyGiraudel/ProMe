import { DICE } from '@/lib/constants/misc'
import './DiceFaces.css'
import { _Translator, useTranslations } from 'next-intl'

function defaultDiceFacesLabel(
  values: readonly number[],
  t: _Translator
): string {
  if (values.length === 0) return ''
  if (values.length === 1) {
    return t('common.die', { value: values[0]! })
  }

  const last = values.at(-1)!
  const rest = values.slice(0, -1)

  return t('common.collection', rest.join(', '), last)
}

export type DiceFacesProps = {
  values: readonly number[]
  /** Overrides the default label built from `values`. */
  ariaLabel?: string
  className?: string
}

export function DiceFaces({ values, ariaLabel, className }: DiceFacesProps) {
  const t = useTranslations()
  const rootClass = ['dice-faces', className].filter(Boolean).join(' ')

  const announcedLabel =
    ariaLabel !== undefined
      ? ariaLabel
      : values.length > 0
        ? defaultDiceFacesLabel(values, t)
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
