import { getTranslations } from 'next-intl/server'
import { JournalTabSection } from '../tabs/JournalTabSection'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.journal_title'),
  }
}

export default function CharacterSheetJournalPage() {
  return <JournalTabSection />
}
