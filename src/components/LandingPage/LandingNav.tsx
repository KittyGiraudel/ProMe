'use client'

import { Layout } from 'antd'
import { Navigation } from '@/components/Navigation/Navigation'

import './LandingNav.css'

export function LandingNav() {
  return (
    <Layout.Header className='LandingNav'>
      <Navigation />
    </Layout.Header>
  )
}
