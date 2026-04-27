'use client'

import { Button as AntdButton, type ButtonProps as AntdButtonProps } from 'antd'
import { useRouter as useNextRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useNavigationBlocker } from '@/components/AppProviders/NavigationBlockerContext'
import { type AppRouteTo, resolveAppToString } from '@/i18n/navigation'

export type AppLinkButtonProps = Omit<AntdButtonProps, 'href'> & {
  to: AppRouteTo
  block?: boolean
}

export function AppLinkButton({
  onClick,
  to,
  target,
  block = false,
  ...props
}: AppLinkButtonProps) {
  const { handler } = useNavigationBlocker()
  const locale = useLocale()
  // Some links contain a hash, which isn’t something supported out of the box
  // by either Next’s or next-intl’s route object notation. So we need to use a
  // resolved href string instead, which requires bypassing the next-intl router
  // since the href will contain the locale already.
  const nextRouter = useNextRouter()
  const resolvedHrefString = resolveAppToString(to, locale)

  return (
    <AntdButton
      {...props}
      href={resolvedHrefString}
      target={target}
      onClick={event => {
        onClick?.(event)
        if (event.defaultPrevented) return
        if (target === '_blank') return
        event.preventDefault()
        if (block && handler) handler(() => nextRouter.push(resolvedHrefString))
        else nextRouter.push(resolvedHrefString)
      }}
    />
  )
}
