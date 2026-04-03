'use client'

import type { FormInstance } from 'antd'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import {
  useCharacterLifeStatusActions,
  useWarnDeath,
} from '@/hooks/useCharacterLifeStatusActions'
import { SaveForm } from '@/hooks/useCharacterSave'
import { Character } from '@/lib/character/types'

type CharacterContextValue = {
  setCharacterValue: (
    path: string | (string | number)[],
    value: unknown
  ) => void
  onKill: () => void
  onRevive: () => void
  isDead: boolean
}

const CharacterContext = createContext<CharacterContextValue | null>(null)

export function CharacterProvider({
  form,
  character,
  saveForm,
  children,
  isDead,
}: {
  form: FormInstance
  character: Character | null
  saveForm: SaveForm
  children: ReactNode
  isDead: boolean
}) {
  // Mark dead / revive and death-suggestion flow; reads live health from the
  // form via derived watches.
  const { onKill, onRevive } = useCharacterLifeStatusActions({ saveForm })

  // Warn the user when their health crosses to non-positive and suggest
  // marking the character as dead.
  useWarnDeath({ form, character, onKill })

  const setCharacterValue = useCallback(
    (path: string | (string | number)[], value: unknown) =>
      form.setFieldValue(path, value),
    [form]
  )

  const value = useMemo<CharacterContextValue>(
    () => ({
      setCharacterValue,
      onKill,
      onRevive,
      isDead,
    }),
    [setCharacterValue, onKill, onRevive, isDead]
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
