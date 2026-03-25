import { getTranslations } from 'next-intl/server'
import { JournalTabSection } from '../tabs/JournalTabSection'
import { AppConfig } from 'next-intl'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.journal.title'),
  }
}

export default function CharacterSheetJournalPage() {
  return <JournalTabSection />
}
