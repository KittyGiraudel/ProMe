import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { ActionsTabSection } from '../tabs/ActionsTabSection'

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
