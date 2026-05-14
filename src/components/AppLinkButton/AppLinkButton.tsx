'use client'

import { Button as AntdButton, type ButtonProps as AntdButtonProps } from 'antd'
import { AppLink, AppLinkProps } from '../Navigation/AppLink'

export type AppLinkButtonProps = Omit<AntdButtonProps, 'href' | 'htmlType'> &
  Pick<AppLinkProps, 'to' | 'block' | 'onNavigate'>

export function AppLinkButton({
  to,
  block = false,
  onNavigate,
  ...props
}: AppLinkButtonProps) {
  return (
    <AppLink
      to={to}
      passHref
      legacyBehavior
      block={block}
      onNavigate={onNavigate}>
      <AntdButton {...props} />
    </AppLink>
  )
}
