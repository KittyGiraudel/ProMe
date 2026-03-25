import { ActionsTabSection } from '../tabs/ActionsTabSection'
import { getTranslations } from 'next-intl/server'
import { AppConfig } from 'next-intl'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.actions.title'),
  }
}

export default function CharacterSheetActionsPage() {
  return <ActionsTabSection />
}
