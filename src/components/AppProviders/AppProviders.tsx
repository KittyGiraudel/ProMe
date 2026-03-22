'use client'

import { ConfigProvider } from 'antd'
import frFR from 'antd/locale/fr_FR'
import type { ReactNode } from 'react'

const theme = {
  token: {
    colorPrimary: '#3d8b7a',
    colorBgLayout: '#f6f9f7',
    borderRadius: 10,
    fontFamily:
      'var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  components: {
    Layout: {
      bodyBg: '#f6f9f7',
    },
  },
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider locale={frFR} theme={theme}>
      {children}
    </ConfigProvider>
  )
}
