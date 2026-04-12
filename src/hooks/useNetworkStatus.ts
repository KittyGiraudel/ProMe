import { App } from 'antd'
import { useEffect } from 'react'
import { characterStore } from '@/lib/character/store'

/**
 * Monitors network connectivity.
 * - Shows a notification when going offline or coming back online.
 * - Triggers a sync to remote on reconnect so locally-saved characters
 *   are pushed to the cloud.
 *
 * Must be mounted inside an Ant Design <App> provider.
 */
export function useNetworkStatus(): void {
  const { message } = App.useApp()

  useEffect(() => {
    function handleOffline() {
      message.info('Now offline — saving locally')
    }

    async function handleOnline() {
      message.info('Back online — syncing to cloud')
      try {
        await characterStore.syncToRemote()
      } catch (error) {
        console.error('Reconnect sync failed:', error)
      }
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [message])
}
