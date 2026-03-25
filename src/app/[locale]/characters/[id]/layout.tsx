import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { CharacterSheetShell } from './CharacterSheetShell'

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
    title: t('characters.title'),
  }
}

export default async function CharacterIdLayout({
  children,
  params,
}: CharacterIdLayoutProps) {
  const { id } = await params
  return <CharacterSheetShell characterId={id}>{children}</CharacterSheetShell>
}
