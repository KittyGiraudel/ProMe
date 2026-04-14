'use client'

import { Layout } from 'antd'
import { Navigation } from '@/components/Navigation/Navigation'
import { useApplyAppTheme } from '@/hooks/useApplyAppTheme'

import './LandingHeader.css'

export function LandingHeader() {
  useApplyAppTheme()
  return (
    <Layout.Header className='LandingHeader'>
      <Navigation />
    </Layout.Header>
  )
}
