'use client'
import { Button as AntdButton, type ButtonProps as AntdButtonProps } from 'antd'
import { useRouter } from '@/i18n/navigation'

export function Button({ onClick, href, ...props }: AntdButtonProps) {
  const router = useRouter()
  return (
    <AntdButton
      {...props}
      onClick={event => {
        onClick?.(event)
        if (event.defaultPrevented) return
        if (!href || !href.startsWith('/')) return
        event.preventDefault()
        router.push(href)
      }}
    />
  )
}
