import type { Metadata } from 'next'
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/app/metadataRoute'
import { CharacterSheet } from '@/components/CharacterSheet/CharacterSheet'

type Props = {
  params: Promise<{ id: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeAsString, id } = await params
  const locale = localeAsString as AppConfig['Locale']
  const t = await getTranslations({ locale })
  const alternates = buildAlternates('character', locale, { id })

  return {
    title: t('characters.title'),
    alternates,
    openGraph: {
      title: t('characters.title'),
      url: alternates.languages[locale],
    },
    robots: { index: false },
  }
}

export default async function CharacterIdPage({ params }: Props) {
  const { id } = await params
  return <CharacterSheet characterId={id} />
}
