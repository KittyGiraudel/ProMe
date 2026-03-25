import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { ToolsTabSection } from '../tabs/ToolsTabSection'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.tools.title'),
  }
}

export default function CharacterSheetToolsPage() {
  return <ToolsTabSection />
}
