import type { Metadata } from 'next'
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { CharacterSheet } from '@/components/CharacterSheet/CharacterSheet'

type Props = {
  params: Promise<{ id: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })
  return { title: t('characters.title'), robots: { index: false } }
}

export default async function CharacterIdPage({ params }: Props) {
  const { id } = await params
  return <CharacterSheet characterId={id} />
}
