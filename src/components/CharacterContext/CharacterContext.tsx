'use client'

import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { SaveForm } from '@/hooks/useCharacterSave'

type CharacterContextValue = {
  saveForm: SaveForm
  isDead: boolean
}

const CharacterContext = createContext<CharacterContextValue | null>(null)

export function CharacterProvider({
  isDead,
  saveForm,
  children,
}: PropsWithChildren<{
  isDead: boolean
  saveForm: SaveForm
}>) {
  const value = useMemo(() => ({ saveForm, isDead }), [saveForm, isDead])

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
