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
  onExport: () => void
  onRevive: () => void
  onDelete: () => void
  isDead: boolean
}

const CharacterContext = createContext<CharacterContextValue | null>(null)

export function CharacterProvider({
  form,
  children,
  onKill,
  onExport,
  onRevive,
  onDelete,
  isDead,
}: {
  form: FormInstance
  children: ReactNode
  onKill: VoidFunction
  onExport: VoidFunction
  onRevive: VoidFunction
  onDelete: VoidFunction
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
      onExport,
      onRevive,
      onDelete,
      isDead,
    }),
    [setCharacterValue, onKill, onExport, onRevive, onDelete, isDead]
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
