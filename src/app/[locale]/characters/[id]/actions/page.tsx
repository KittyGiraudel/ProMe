import { ActionsTabSection } from '../tabs/ActionsTabSection'
import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.actions_title'),
  }
}

export default function CharacterSheetActionsPage() {
  return <ActionsTabSection />
}
