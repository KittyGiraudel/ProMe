'use client'

import { useNetworkStatus } from '@/hooks/useNetworkStatus'

/**
 * Mounts the network status hook at app level so reconnect syncs fire
 * regardless of which page the user is on.
 * Must be rendered inside an Ant Design <App> provider.
 */
export function NetworkStatusMonitor() {
  useNetworkStatus()
  return null
}
