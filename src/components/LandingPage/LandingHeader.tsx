'use client'

import { NewNavigation } from '@/components/Navigation/NewNavigation'
import { useApplyAppTheme } from '@/hooks/useApplyAppTheme'

export function LandingHeader() {
  useApplyAppTheme()
  return <NewNavigation />
}
