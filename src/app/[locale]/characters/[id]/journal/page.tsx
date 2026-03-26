import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { JournalCard } from '@/components/PageCharacterSheet/JournalCard'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.journal.title'),
  }
}

export default function CharacterJournalPage() {
  return <JournalCard />
}
