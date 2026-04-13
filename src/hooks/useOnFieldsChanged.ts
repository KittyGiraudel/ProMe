import { FormProps } from 'antd'
import { FormInstance } from 'antd/es/form'
import { useCallback } from 'react'
import { normalizeClock } from '@/lib/clock/clock'
import { useWatchedClock } from './useCharacterSheetDerived'

type FieldData = Parameters<Required<FormProps>['onFieldsChange']>[0][number]

export function useOnFieldsChanged(form: FormInstance) {
  const { clock, updateClock } = useWatchedClock(form)

  const onFieldsChange: Required<FormProps>['onFieldsChange'] = useCallback(
    (changedFields: FieldData[]) => {
      const staminaCurrentField = changedFields.find(
        field =>
          Array.isArray(field.name) &&
          field.name.length === 2 &&
          field.name[0] === 'stamina' &&
          field.name[1] === 'current'
      )
      if (staminaCurrentField) {
        updateClock(normalizeClock(clock, staminaCurrentField.value as number))
      }
    },
    [updateClock, clock]
  )

  return onFieldsChange
}
