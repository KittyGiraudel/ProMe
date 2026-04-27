import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/app/metadataRoute'
import { CharacterCreate } from '@/components/PageCharacterCreate/CharacterCreate'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale: localeAsString } = await params
  const locale = localeAsString as AppConfig['Locale']
  const t = await getTranslations({ locale })
  const alternates = buildAlternates('newCharacter', locale)

  return {
    title: t('new_character.title'),
    alternates,
    openGraph: {
      title: t('new_character.title'),
      url: alternates.languages[locale],
    },
  }
}

export default function CharacterCreatePage() {
  return <CharacterCreate />
}
