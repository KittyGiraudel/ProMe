import { SettingsPageClient } from './SettingsPageClient'
import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('settings.page_title'),
  }
}

export default function SettingsPage() {
  return <SettingsPageClient />
}
