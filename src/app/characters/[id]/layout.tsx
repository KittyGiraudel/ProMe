import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { copy } from '@/messages/fr'
import { characterSheetMetadataTitle } from './characterSheetTitle'
import { CharacterSheetShell } from './CharacterSheetShell'

type CharacterIdLayoutProps = {
  children: ReactNode
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: CharacterIdLayoutProps): Promise<Metadata> {
  await params
  return {
    title: characterSheetMetadataTitle('identity'),
    description: copy.characters.sheetDescription,
  }
}

export default async function CharacterIdLayout({
  children,
  params,
}: CharacterIdLayoutProps) {
  const { id } = await params
  return <CharacterSheetShell characterId={id}>{children}</CharacterSheetShell>
}
