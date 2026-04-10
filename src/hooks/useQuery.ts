'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import { loadSettings } from '@/lib/settings/storage'
import type { AppSettings } from '@/lib/settings/types'

export type QueryResult<T> = {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useQuery<T>(fetcher: () => Promise<T>): QueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetcherRef
      .current()
      .then(result => {
        if (!cancelled) {
          setData(result)
          setError(null)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [tick])

  const refetch = useCallback(() => setTick(t => t + 1), [])

  return { data, loading, error, refetch }
}

export function useSettingsQuery(): QueryResult<AppSettings> {
  return useQuery(() => Promise.resolve(loadSettings()))
}

type UseCharacterQueryOptions = {
  id: string
}

export function useCharacterQuery({
  id,
}: UseCharacterQueryOptions): QueryResult<Character | null> {
  return useQuery(() => Promise.resolve(getCharacterStore().get(id)))
}

type UseCharactersQueryOptions = {
  limit?: number
}

export function useCharactersQuery({
  limit = Infinity,
}: UseCharactersQueryOptions = {}): QueryResult<Character[]> {
  return useQuery(() =>
    Promise.resolve(getCharacterStore().list().slice(0, limit))
  )
}
