import { getTranslations } from 'next-intl/server'
import { ToolsTabSection } from '../tabs/ToolsTabSection'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.tools_title'),
  }
}

export default function CharacterSheetToolsPage() {
  return <ToolsTabSection />
}
