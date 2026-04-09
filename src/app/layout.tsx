import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Geist, Geist_Mono } from 'next/font/google'
import Head from 'next/head'
import { getLocale } from 'next-intl/server'
import { AppProviders } from '@/components/AppProviders/AppProviders'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}>
      <Head>
        <link
          rel='icon'
          type='image/png'
          href='/favicon-96x96.png'
          sizes='96x96'
        />
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <link rel='shortcut icon' href='/favicon.ico' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <meta name='apple-mobile-web-app-title' content='ProMe' />
        <link rel='manifest' href='/manifest.webmanifest' />
      </Head>
      <body>
        <AntdRegistry>
          <AppProviders>
            <div className='app-shell'>{children}</div>
          </AppProviders>
        </AntdRegistry>
      </body>
    </html>
  )
}
