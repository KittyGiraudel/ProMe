'use client'

import type { CharacterMapState } from '@/lib/character/types'

type Props = {
  value?: CharacterMapState
  onChange?: (value: CharacterMapState) => void
}

/**
 * Registers `map` on the Ant Design Form without rendering UI.
 * `MapCard` updates the value via `setFieldValue`; with a registered field,
 * `setFields({ touched: true })` and touch/dirty tracking work for unsaved guards.
 */
export function MapFormValueAnchor(_props: Props) {
  return null
}
