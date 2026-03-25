import type { Metadata } from 'next'
import { characterSheetMetadataTitle } from '../characterSheetTitle'
import { ActionsTabSection } from '../tabs/ActionsTabSection'

export const metadata: Metadata = {
  title: characterSheetMetadataTitle('actions'),
}

export default function CharacterSheetActionsPage() {
  return <ActionsTabSection />
}
