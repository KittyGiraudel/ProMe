'use client'
import { Button as AntdButton, type ButtonProps as AntdButtonProps } from 'antd'
import { useRouter } from '@/i18n/navigation'

export type ButtonProps = AntdButtonProps

export function Button({ onClick, href, target, ...props }: AntdButtonProps) {
  const router = useRouter()
  return (
    <AntdButton
      {...props}
      href={href}
      target={target}
      onClick={event => {
        onClick?.(event)
        if (event.defaultPrevented) return
        if (!href || !href.startsWith('/')) return
        if (target === '_blank') return
        event.preventDefault()
        router.push(href)
      }}
    />
  )
}
