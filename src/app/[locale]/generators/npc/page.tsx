import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { buildAlternates } from '@/app/metadataRoute'
import { NpcGeneratorFallback } from '@/components/PageGeneratorNpc/Fallback'
import { NpcGenerator } from '@/components/PageGeneratorNpc/NpcGenerator'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale: localeAsString } = await params
  const locale = localeAsString as AppConfig['Locale']
  const t = await getTranslations({ locale })
  const alternates = buildAlternates('npcGenerator', locale)

  return {
    title: t('inhabitant.title'),
    alternates,
    openGraph: {
      title: t('inhabitant.title'),
      url: alternates.languages[locale],
    },
  }
}

export default function NpcGeneratorPage() {
  return (
    <Suspense fallback={<NpcGeneratorFallback />}>
      <NpcGenerator initialRoll={null} />
    </Suspense>
  )
}
