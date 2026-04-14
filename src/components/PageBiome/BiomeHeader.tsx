'use client'

import { Layout } from 'antd'
import { useEffect, useState } from 'react'
import { Navigation } from '@/components/Navigation/Navigation'

import './BiomeHeader.css'

export function BiomeHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Layout.Header className='BiomeHeader' data-scrolled={scrolled}>
      <Navigation />
    </Layout.Header>
  )
}
