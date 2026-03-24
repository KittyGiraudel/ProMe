import type { Metadata } from 'next'
import { characterSheetMetadataTitle } from '../characterSheetTitle'
import { ToolsTabSection } from '../tabs/ToolsTabSection'

export const metadata: Metadata = {
  title: characterSheetMetadataTitle('tools'),
}

export default function CharacterSheetToolsPage() {
  return <ToolsTabSection />
}
