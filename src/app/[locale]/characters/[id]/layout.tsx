import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { CharacterSheetShell } from './CharacterSheetShell'
import { getTranslations } from 'next-intl/server'
import { AppConfig } from 'next-intl'

type CharacterIdLayoutProps = {
  children: ReactNode
  params: Promise<{ id: string; locale: AppConfig['Locale'] }>
}

export async function generateMetadata({
  params,
}: CharacterIdLayoutProps): Promise<Metadata> {
  await params
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.sheet_title'),
  }
}

export default async function CharacterIdLayout({
  children,
  params,
}: CharacterIdLayoutProps) {
  const { id } = await params
  return <CharacterSheetShell characterId={id}>{children}</CharacterSheetShell>
}
