import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { ActionsCard } from '@/components/ActionsCard/ActionsCard'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: t('characters.actions.title'),
  }
}

export default function CharacterActionsPage() {
  return <ActionsCard />
}
