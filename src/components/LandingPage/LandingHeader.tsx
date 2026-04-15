'use client'

import { Navigation } from '@/components/Navigation/Navigation'
import { useApplyAppTheme } from '@/hooks/useApplyAppTheme'

export function LandingHeader() {
  useApplyAppTheme()
  return <Navigation />
}
