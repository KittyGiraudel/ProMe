import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Geist, Geist_Mono } from 'next/font/google'
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

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: {
      default: t('metadata.title'),
      template: `%s — ${t('metadata.tab_brand')}`,
    },
    description: t('metadata.description'),
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable}`}>
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
