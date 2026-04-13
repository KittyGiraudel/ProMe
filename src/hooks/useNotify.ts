import { App, NotificationArgsProps } from 'antd'
import { useCallback, useMemo } from 'react'
import { getPWADisplayMode } from '@/lib/getPWADisplayMode'

export function useNotify() {
  const { notification } = App.useApp()

  const notify = useCallback(
    (type: 'open' | 'info' | 'warning' | 'error' | 'success') => {
      return (config: NotificationArgsProps) => {
        if ('vibrate' in navigator && getPWADisplayMode() === 'standalone') {
          navigator.vibrate(200)
        }
        notification[type](config)
      }
    },
    [notification]
  )

  const info = notify('info')
  const warning = notify('warning')
  const success = notify('success')
  const open = notify('open')
  const error = notify('error')

  const destroy = useCallback(
    (id: string) => notification.destroy(id),
    [notification]
  )

  return useMemo(
    () => ({ info, success, open, warning, error, destroy }),
    [info, success, open, warning, error, destroy]
  )
}
