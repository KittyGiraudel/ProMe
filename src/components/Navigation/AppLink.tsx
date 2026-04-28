'use client'

import NextLink from 'next/link'
import { useRouter as useNextRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import type { ComponentProps } from 'react'
import { useNavigationBlocker } from '@/components/AppProviders/NavigationBlockerContext'
import { type AppRouteTo, resolveAppToString } from '@/i18n/navigation'

type NextLinkProps = ComponentProps<typeof NextLink>

export type AppLinkProps = Omit<NextLinkProps, 'href'> & {
  to: AppRouteTo
  block?: boolean
}

export function AppLink({
  to,
  block = false,
  onNavigate,
  ...props
}: AppLinkProps) {
  const { handler } = useNavigationBlocker()
  const locale = useLocale()
  // Some links contain a hash, which isn’t something supported out of the box
  // by either Next’s or next-intl’s route object notation. So we need to use a
  // resolved href string instead, which requires bypassing the next-intl router
  // since the href will contain the locale already.
  const nextRouter = useNextRouter()
  const resolvedHrefString = resolveAppToString(to, locale)

  return (
    <NextLink
      {...props}
      href={resolvedHrefString}
      onNavigate={event => {
        onNavigate?.(event)
        if (!block || !handler || props?.target === '_blank') return
        event.preventDefault()
        handler(() => nextRouter.push(resolvedHrefString))
      }}
    />
  )
}
