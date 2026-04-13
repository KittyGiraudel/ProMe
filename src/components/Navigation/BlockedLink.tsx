'use client'

import { resolveHref } from 'next/dist/client/resolve-href'
import { type LinkProps } from 'next/link'
import Router from 'next/router'
import type { ComponentProps } from 'react'
import { useNavigationBlocker } from '@/components/AppProviders/NavigationBlockerContext'
import { Link as NextLink, useRouter } from '@/i18n/navigation'

type Props = Omit<ComponentProps<typeof NextLink>, 'href'> & {
  href: LinkProps['href']
}

export function BlockedLink({ href, onNavigate, ...props }: Props) {
  const router = useRouter()
  const { handler } = useNavigationBlocker()
  const url = resolveHref(Router, href)

  return (
    <NextLink
      {...props}
      href={href}
      onNavigate={e => {
        onNavigate?.(e)
        if (!handler) return
        // Cancel Next navigation, then run our handler.
        e.preventDefault()
        handler(() => router.push(url))
      }}
    />
  )
}
