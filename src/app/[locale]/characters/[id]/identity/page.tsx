import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { IdentityTabSection } from '../tabs/IdentityTabSection'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.identity.title'),
  }
}

export default function CharacterSheetIdentityPage() {
  return <IdentityTabSection />
}
