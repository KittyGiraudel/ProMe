import { AppConfig } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { use } from 'react'
import { HomeHub } from '@/components/HomeHub/HomeHub'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: { absolute: t('metadata.title') },
  }
}

export default function Home({ params }: Props) {
  const { locale } = use(params)

  // Enable static rendering
  setRequestLocale(locale as AppConfig['Locale'])

  return <HomeHub />
}
