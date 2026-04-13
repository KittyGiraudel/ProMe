'use client'

import type { CharacterMapState } from '@/lib/character/types'

type MapFormValueAnchorProps = {
  value?: CharacterMapState
  onChange?: (value: CharacterMapState) => void
}

/**
 * Registers `map` on the Ant Design Form without rendering UI.
 * `MapCard` updates the value via `setFieldValue`; with a registered field,
 * `setFields({ touched: true })` and touch/dirty tracking work for unsaved guards.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function MapFormValueAnchor(_: MapFormValueAnchorProps) {
  return null
}
