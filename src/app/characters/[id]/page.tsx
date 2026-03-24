import type { Metadata } from 'next'
import { CharacterSheetClient } from './CharacterSheetClient'
import { copy } from '@/messages/fr'

type CharacterPageProps = {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: copy.characters.sheetTitle,
  description: copy.characters.sheetDescription,
}

export default async function CharacterSheetPage({
  params,
}: CharacterPageProps) {
  const { id } = await params
  return <CharacterSheetClient characterId={id} />
}
