'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getCharacterStore } from '@/lib/character/store'
import {
  BadRequestError,
  ServerError,
  UnauthorizedError,
} from '@/lib/character/store/remoteStore'
import type { Character } from '@/lib/character/types'
import { loadSettings } from '@/lib/settings/storage'
import type { AppSettings } from '@/lib/settings/types'

export type QueryResult<T> = {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => void
}

type UseQueryOptions = {
  skip?: boolean
}

export function useQuery<T>(
  fetcher: () => Promise<T>,
  { skip = false }: UseQueryOptions = {}
): QueryResult<T> {
  const t = useTranslations()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(!skip)
  const [error, setError] = useState<Error | null>(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (skip) return
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
          if (err instanceof UnauthorizedError) {
            setError(new Error(t('errors.unauthorized')))
          } else if (err instanceof BadRequestError) {
            setError(new Error(t('errors.bad_request')))
          } else if (err instanceof ServerError) {
            setError(
              new Error(t('errors.server', { status: String(err.status) }))
            )
          } else {
            setError(err instanceof Error ? err : new Error(String(err)))
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [tick, skip, t])

  const refetch = useCallback(() => setTick(tick => tick + 1), [])

  return { data, loading, error, refetch }
}

export function useSettingsQuery(): QueryResult<AppSettings> {
  return useQuery(() => Promise.resolve(loadSettings()))
}

type UseCharacterQueryOptions = {
  id: string
  skip?: boolean
}

export function useCharacterQuery({
  id,
  skip,
}: UseCharacterQueryOptions): QueryResult<Character | null> {
  return useQuery(() => getCharacterStore().get(id), { skip })
}

type UseCharactersQueryOptions = {
  limit?: number
}

export function useCharactersQuery({
  limit = Infinity,
}: UseCharactersQueryOptions = {}): QueryResult<Character[]> {
  return useQuery(() =>
    getCharacterStore()
      .list()
      .then(chars => chars.slice(0, limit))
  )
}
