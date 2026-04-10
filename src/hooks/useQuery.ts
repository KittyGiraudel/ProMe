'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

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
