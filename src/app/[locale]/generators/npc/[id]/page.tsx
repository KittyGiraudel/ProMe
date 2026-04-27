import { notFound } from 'next/navigation'
import { AppConfig } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { buildAlternates } from '@/app/metadataRoute'
import { NpcGeneratorFallback } from '@/components/PageGeneratorNpc/Fallback'
import { NpcGenerator } from '@/components/PageGeneratorNpc/NpcGenerator'
import { decodeInhabitantRollParam } from '@/lib/inhabitant/inhabitantUrlCodec'

type Props = { params: Promise<{ locale: string; id: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale: localeAsString, id } = await params
  const locale = localeAsString as AppConfig['Locale']
  const t = await getTranslations({ locale })
  const alternates = buildAlternates('npc', locale, { id })

  return {
    title: t('inhabitant.title'),
    alternates,
    openGraph: {
      title: t('inhabitant.title'),
      url: alternates.languages[locale],
    },
    robots: { index: false },
  }
}

export default async function NpcGeneratorIdPage({ params }: Props) {
  const { locale: localeAsString, id } = await params
  const locale = localeAsString as AppConfig['Locale']
  const t = await getTranslations({ locale })

  const roll = decodeInhabitantRollParam(id, t)
  if (!roll) notFound()

  return (
    <Suspense fallback={<NpcGeneratorFallback />}>
      <NpcGenerator initialRoll={roll} />
    </Suspense>
  )
}
