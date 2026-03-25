import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { CharacterLibraryClient } from './CharacterLibraryClient'

type Props = { params: Promise<{ locale: AppConfig['Locale'] }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('characters.title'),
  }
}

export default function CharactersPage() {
  return <CharacterLibraryClient />
}
