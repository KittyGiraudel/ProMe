import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/app/metadataRoute'
import { CharacterLibrary } from '@/components/PageCharacterLibrary/CharacterLibrary'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale: localeAsString } = await params
  const locale = localeAsString as AppConfig['Locale']
  const t = await getTranslations({ locale })
  const alternates = buildAlternates('characters', locale)

  return {
    title: t('characters_list.title'),
    alternates,
    openGraph: {
      title: t('characters_list.title'),
      url: alternates.languages[locale],
    },
  }
}

export default function CharactersPage() {
  return <CharacterLibrary />
}
