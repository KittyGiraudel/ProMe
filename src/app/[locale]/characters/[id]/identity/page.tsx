import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { CharacteristicsCard } from '@/components/CharacteristicsCard/CharacteristicsCard'
import { IdentityCard } from '@/components/IdentityCard/IdentityCard'
import { Spacing } from '@/components/Spacing/Spacing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as AppConfig['Locale'] })

  return {
    title: t('characters.identity.title'),
  }
}

export default function CharacterIdentityPage() {
  return (
    <Spacing>
      <IdentityCard isArchetypeReadonly />
      <CharacteristicsCard />
    </Spacing>
  )
}
