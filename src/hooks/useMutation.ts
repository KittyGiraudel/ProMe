'use client'

import { useCallback, useRef, useState } from 'react'
import { createCharacterFromIdentity } from '@/lib/character/createFromIdentity'
import { getCharacterStore } from '@/lib/character/store'
import type { Archetype, Character } from '@/lib/character/types'
import { saveSettings } from '@/lib/settings/storage'
import type { AppSettings } from '@/lib/settings/types'
import type { Gender } from '@/lib/types'

export type MutationResult<TData> = {
  data: TData | null
  loading: boolean
  error: Error | null
}

export type MutationOptions<TData> = {
  onCompleted?: (data: TData) => void
  onError?: (error: Error) => void
}

export function useMutation<TData, TVariables>(
  fn: (variables: TVariables) => Promise<TData>,
  options?: MutationOptions<TData>
): [
  mutate: (variables: TVariables) => Promise<void>,
  result: MutationResult<TData>,
] {
  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const fnRef = useRef(fn)
  fnRef.current = fn
  const optionsRef = useRef(options)
  optionsRef.current = options

  const mutate = useCallback(async (variables: TVariables) => {
    setLoading(true)
    try {
      const result = await fnRef.current(variables)
      setData(result)
      setError(null)
      optionsRef.current?.onCompleted?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      optionsRef.current?.onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [])

  return [mutate, { data, loading, error }]
}

export function useCharacterSave(options?: MutationOptions<Character>) {
  return useMutation(
    (character: Character) => getCharacterStore().save(character),
    options
  )
}

export type CharacterCreateValues = {
  name: string
  archetype: Archetype
  gender?: Gender
  inheritFromCharacterId?: string
}

export function useCharacterCreate(options?: MutationOptions<Character>) {
  return useMutation(async (values: CharacterCreateValues) => {
    const source = values.inheritFromCharacterId
      ? await getCharacterStore().get(values.inheritFromCharacterId)
      : null
    const created = createCharacterFromIdentity(
      {
        name: values.name,
        archetype: values.archetype,
        gender: values.gender,
      },
      source ?? undefined
    )
    return getCharacterStore().save(created)
  }, options)
}

export function useCharacterDelete(options?: MutationOptions<boolean>) {
  return useMutation(
    ({ id }: { id: string }) => getCharacterStore().delete(id),
    options
  )
}

export function useSettingsSave(options?: MutationOptions<void>) {
  return useMutation((settings: AppSettings) => {
    saveSettings(settings)
    return Promise.resolve()
  }, options)
}
