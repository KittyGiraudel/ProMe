'use client'

import type { FormInstance } from 'antd'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react'

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
  children,
  onKill,
  onRevive,
  isDead,
}: {
  form: FormInstance
  children: ReactNode
  onKill: VoidFunction
  onRevive: VoidFunction
  isDead: boolean
}) {
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
