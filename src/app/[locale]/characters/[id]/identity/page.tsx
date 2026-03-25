import { AppConfig } from 'next-intl'
import { IdentityTabSection } from '../tabs/IdentityTabSection'
import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.identity_title'),
  }
}

export default function CharacterSheetIdentityPage() {
  return <IdentityTabSection />
}
