import { AntdRegistry } from '@ant-design/nextjs-registry'
import type { Metadata, Viewport } from 'next'
import { getLocale } from 'next-intl/server'
import { AppProviders } from '@/components/AppProviders/AppProviders'

import 'antd/dist/reset.css'
import 'antd/dist/antd.css'
import './globals.css'
import './antd-fix.css'

const isDev = process.env.NODE_ENV === 'development'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8f3' },
    { media: '(prefers-color-scheme: dark)', color: '#1a2420' },
  ],
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('https://prome.games'),
    icons: {
      icon: [
        {
          url: isDev ? '/favicon-96x96-dev.png' : '/favicon-96x96.png',
          sizes: '96x96',
          type: 'image/png',
        },
      ],
      shortcut: isDev ? '/favicon-dev.ico' : '/favicon.ico',
      apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={locale}>
      <body>
        <AntdRegistry>
          <AppProviders locale={locale as 'fr' | 'en'}>
            <div className='app-shell'>{children}</div>
          </AppProviders>
        </AntdRegistry>
      </body>
    </html>
  )
}
