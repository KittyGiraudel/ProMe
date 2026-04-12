'use client'

import { App, Form } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo, useRef, useState } from 'react'
import {
  ValidationError,
  ValidationErrorCollection,
} from '@/lib/character/store/localStorageStore'
import { SheetFormValues, toFormValues } from '@/lib/character/toFormValues'
import type { Character } from '@/lib/character/types'
import type { TranslationKey } from '@/lib/types'
import { useCharacterSaveGuard } from './useCharacterSaveGuard'
import { useCharacterSave } from './useMutation'
import { useCharacterQuery } from './useQuery'

export type SaveCharacterOptions = { successKey?: TranslationKey }
export type SaveForm = (
  overload?: Partial<Character>,
  options?: SaveCharacterOptions
) => void

export function useCharacterSheetForm({
  characterId,
}: {
  characterId: string
}) {
  const [form] = Form.useForm<SheetFormValues>()
  const {
    data: character,
    loading,
    refetch,
  } = useCharacterQuery({ id: characterId })
  const { message } = App.useApp()
  const t = useTranslations()
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  )
  const successKeyRef = useRef<TranslationKey>(
    'characters.actions.save.success'
  )

  const [save] = useCharacterSave({
    onCompleted: saved => {
      // Sync form fields immediately from the mutation result rather than
      // waiting for refetch() to update `character` state and reacting to that.
      form.setFieldsValue(toFormValues(saved))
      // Still refetch so `character` state stays current for other consumers
      // (document title, dead check, theme, etc.).
      refetch()
      message.success(t(successKeyRef.current))
    },
    onError: err => {
      if (err instanceof ValidationErrorCollection) {
        setValidationErrors(err.errors)
        message.warning(t('errors.save_validation'))
      } else if (err.message === 'DEAD_CHARACTER') {
        message.error(t('errors.save_dead'))
      } else {
        message.error(t('errors.save'))
      }
    },
  })

  const saveForm: SaveForm = useCallback(
    (overload?: Partial<Character>, options?: SaveCharacterOptions) => {
      setValidationErrors([])
      successKeyRef.current =
        options?.successKey ?? 'characters.actions.save.success'
      void save({
        ...character,
        ...form.getFieldsValue(true),
        ...overload,
      } as Character)
    },
    [character, form, save]
  )

  useCharacterSaveGuard({ form, character })

  return useMemo(
    () => ({ form, character, loading, saveForm, validationErrors }),
    [form, character, loading, saveForm, validationErrors]
  )
}
