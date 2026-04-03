'use client'

import { App, FormInstance } from 'antd'
import { useTranslations } from 'next-intl'
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react'
import { getCharacterStore } from '@/lib/character/store'
import {
  SaveError,
  ValidationError,
} from '@/lib/character/store/localStorageStore'
import type { Character } from '@/lib/character/types'
import { TranslationKey } from '@/lib/types'
import { useCharacterFromForm } from './useCharacterFromForm'

export type SaveCharacterOptions = { successKey?: TranslationKey }
export type SaveCharacter = (
  character: Character,
  options?: SaveCharacterOptions
) => void

export type SaveForm = (
  overload?: Partial<Character>,
  options?: SaveCharacterOptions
) => void

export function useCharacterSave({
  form,
  character,
  onSave,
}: {
  form: FormInstance
  character: Character | null
  onSave: Dispatch<SetStateAction<Character | null>>
}) {
  const t = useTranslations()
  const { message } = App.useApp()
  const store = useMemo(() => getCharacterStore(), [])

  const saveCharacter: SaveCharacter = useCallback(
    (character: Character, options?: SaveCharacterOptions) => {
      const successKey =
        options?.successKey ?? 'characters.actions.save.success'

      try {
        // Persist the character in the store
        const saved = store.save(character)

        // Fire the save callback to let the call site know
        onSave(saved)

        // Display a successful message
        message.success(t(successKey))
      } catch (error) {
        // Log the error for debugging purposes
        console.error(error)

        // If the error is related to validation, display the warning
        if (error instanceof ValidationError)
          message.warning(error.errors.join('\n'))
        else if (error instanceof SaveError) {
          // Indicate that a dead character cannot be modified
          if (error.message === 'DEAD_CHARACTER')
            message.error(t('characters.actions.save.dead_error'))
          // Indicate that the payload is incorrect (shouldn’t happen)
          else if (error.message === 'INVALID_PAYLOAD')
            message.error(t('characters.actions.save.validation_error'))
          // Display a generic error
        } else message.error(t('common.generic_error'))
      }
    },
    [store, onSave, message, t]
  )

  const getCharacterFromForm = useCharacterFromForm({ character, form })
  const saveForm: SaveForm = useCallback(
    (overload?: Partial<Character>, options?: SaveCharacterOptions) =>
      saveCharacter({ ...getCharacterFromForm(), ...overload }, options),
    [saveCharacter, getCharacterFromForm]
  )

  return useMemo(() => ({ saveCharacter, saveForm }), [saveCharacter, saveForm])
}
