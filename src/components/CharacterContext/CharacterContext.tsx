'use client'

import type { FormInstance } from 'antd'
import {
  createContext,
  PropsWithChildren,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import { SaveForm } from '@/hooks/useCharacterSave'
import { isCharacterDead } from '@/lib/character/lifeStatus'
import { Character } from '@/lib/character/types'

type CharacterContextValue = {
  setCharacterValue: (
    path: string | (string | number)[],
    value: unknown
  ) => void
  saveForm: SaveForm
  isDead: boolean
}

const CharacterContext = createContext<CharacterContextValue | null>(null)

export function CharacterProvider({
  form,
  character,
  saveForm,
  children,
}: PropsWithChildren<{
  form: FormInstance
  character: Character | null
  saveForm: SaveForm
}>) {
  const isDead = character ? isCharacterDead(character) : false

  const setCharacterValue: CharacterContextValue['setCharacterValue'] =
    useCallback((path, value) => form.setFieldValue(path, value), [form])

  const value = useMemo<CharacterContextValue>(
    () => ({ setCharacterValue, saveForm, isDead }),
    [setCharacterValue, saveForm, isDead]
  )

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  )
}

export function useCharacterContext(): CharacterContextValue {
  const context = useContext(CharacterContext)
  if (!context) {
    throw new Error(
      'useCharacterContext must be used within a CharacterProvider'
    )
  }
  return context
}
