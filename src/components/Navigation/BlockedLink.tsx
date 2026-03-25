'use client'

import NextLink from 'next/link'
import type { UrlObject } from 'url'
import { useRouter } from 'next/navigation'
import type { ComponentProps } from 'react'
import { useCallback } from 'react'
import { useNavigationBlocker } from '@/app/[locale]/contexts/NavigationBlockerContext'

type Href = string | UrlObject

function hrefToString(href: Href): string {
  if (typeof href === 'string') return href

  // Minimal conversion: this project mostly uses string hrefs.
  const pathname = href.pathname ?? '/'
  const query = href.query
  if (!query || typeof query !== 'object') return pathname.toString()

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value == null) continue
    if (Array.isArray(value)) {
      for (const v of value) params.append(key, String(v))
    } else {
      params.set(key, String(value))
    }
  }
  const qs = params.toString()
  return qs ? `${pathname.toString()}?${qs}` : pathname.toString()
}

type Props = Omit<ComponentProps<typeof NextLink>, 'href'> & {
  href: Href
}

export function BlockedLink({ href, onNavigate, ...props }: Props) {
  const router = useRouter()
  const { handler } = useNavigationBlocker()

  const navigate = useCallback(() => {
    void router.push(hrefToString(href))
  }, [href, router])

  return (
    <NextLink
      {...props}
      href={href}
      onNavigate={e => {
        onNavigate?.(e)
        if (!handler) return
        // Cancel Next navigation, then run our handler.
        e.preventDefault()
        handler(navigate)
      }}
    />
  )
}
