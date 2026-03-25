import { AntdRegistry } from '@ant-design/nextjs-registry'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AppProviders } from '@/components/AppProviders/AppProviders'
import { PageCover } from '@/components/PageCover/PageCover'
import { defaultLocale, getMessages } from '@/messages/locales'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: getMessages().metadata.title,
    template: `%s — ${getMessages().metadata.tabBrand}`,
  },
  description: getMessages().metadata.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang={defaultLocale}
      className={`${geistSans.variable} ${geistMono.variable}`}>
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
