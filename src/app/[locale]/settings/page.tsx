import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { SettingsPageClient } from './SettingsPageClient'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('settings.title'),
  }
}

export default function SettingsPage() {
  return <SettingsPageClient />
}
