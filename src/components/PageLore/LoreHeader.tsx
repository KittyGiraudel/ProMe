'use client'

import { Layout } from 'antd'
import { useEffect, useState } from 'react'
import { Navigation } from '@/components/Navigation/Navigation'

export function LoreHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Layout.Header
      className={`LoreHeader${scrolled ? ' LoreHeader--scrolled' : ''}`}>
      <Navigation />
    </Layout.Header>
  )
}
