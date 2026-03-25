'use client'
import { Button as AntdButton, type ButtonProps as AntdButtonProps } from 'antd'
import { useRouter } from '@/i18n/navigation'

export function Button(props: AntdButtonProps) {
  const router = useRouter()
  return (
    <AntdButton
      {...props}
      onClick={event => {
        props.onClick?.(event)
        if (event.defaultPrevented) return
        if (!props.href || !props.href.startsWith('/')) return
        event.preventDefault()
        router.push(props.href)
      }}
    />
  )
}
