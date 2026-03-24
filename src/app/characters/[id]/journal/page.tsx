import type { Metadata } from 'next'
import { characterSheetMetadataTitle } from '../characterSheetTitle'
import { JournalTabSection } from '../tabs/JournalTabSection'

export const metadata: Metadata = {
  title: characterSheetMetadataTitle('journal'),
}

export default function CharacterSheetJournalPage() {
  return <JournalTabSection />
}
