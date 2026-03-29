import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Settings } from '@/components/PageSettings/Settings'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: t('settings.title'),
  }
}

export default function SettingsPage() {
  return <Settings />
}
