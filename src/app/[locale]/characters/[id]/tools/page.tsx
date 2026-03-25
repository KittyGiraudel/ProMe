import { getTranslations } from 'next-intl/server'
import { ToolsTabSection } from '../tabs/ToolsTabSection'
import { AppConfig } from 'next-intl'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('tools.title'),
  }
}

export default function CharacterSheetToolsPage() {
  return <ToolsTabSection />
}
