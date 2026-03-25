'use client'

import { useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { usePathname } from '@/i18n/navigation'
import { useRouter } from '@/i18n/navigation'

/**
 * Clone current search params, mutate, then `router.replace` (scroll: false).
 * Drops the query string entirely when the result is empty.
 */
export function useReplaceSearchParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const replaceSearchParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString())
      mutate(params)
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  return { replaceSearchParams, pathname, searchParams }
}
