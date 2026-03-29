'use client'

import { useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Typography } from 'antd'
import { useRouter } from '@/i18n/navigation'
import type {
  InhabitantRoll,
  InhabitantRerollPart,
} from '@/lib/inhabitant/generate'
import {
  generateInhabitant,
  rerollInhabitantPart,
  getAgeBand,
  getPersonality,
} from '@/lib/inhabitant/generate'
import { encodeInhabitantRoll } from '@/lib/inhabitant/inhabitantUrlCodec'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import { InhabitantSummary } from '@/components/InhabitantSummary/InhabitantSummary'
import { Layout } from '@/components/Layout/Layout'
import { RollActions } from '@/components/RollActions/RollActions'

export function NpcGenerator({
  initialRoll: roll,
}: {
  initialRoll: InhabitantRoll | null
}) {
  const t = useTranslations()
  const router = useRouter()

  const pushToRoll = useCallback(
    (roll: InhabitantRoll) =>
      router.push(`/generators/npc/${encodeInhabitantRoll(roll)}`, {
        scroll: false,
      }),
    [router]
  )

  const handleGenerate = useCallback(
    () => pushToRoll(generateInhabitant(t)),
    [pushToRoll, t]
  )

  const handleRerollPart = useCallback(
    (part: InhabitantRerollPart) => {
      if (!roll) return
      const next = rerollInhabitantPart(roll, part, t)
      pushToRoll(next)
    },
    [pushToRoll, roll, t]
  )

  const handleSetRoll = useCallback(
    (next: InhabitantRoll) => pushToRoll(next),
    [pushToRoll]
  )

  const copyPayload = useMemo(() => {
    if (!roll) return null
    const description = t('inhabitant.one_liner', {
      gender: genderCompactSymbol(roll.gender),
      name: roll.name,
      faction: t(`common.factions.${roll.faction}`),
      age: t(`common.age_bands.${getAgeBand(roll)}`),
      personality: t(`common.personalities.${getPersonality(roll)}`, {
        gender: roll.gender,
      }),
    })
    return {
      description,
      journalBrace: `{npc/${encodeInhabitantRoll(roll)}}`,
    }
  }, [roll, t])

  return (
    <Layout
      title={t('inhabitant.title')}
      bannerBiome='fieldSea'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.inhabitant_generator'), path: '/generators/npc' },
      ]}
      headerActions={
        <RollActions
          onRoll={handleGenerate}
          label={t('inhabitant.generate')}
          copy={copyPayload}
        />
      }>
      <InhabitantSummary
        roll={roll}
        onRerollPart={roll ? handleRerollPart : undefined}
        onSetRoll={roll ? handleSetRoll : undefined}
      />
      <Typography.Paragraph type='secondary'>
        {t('rulebook.inhabitant_footnote')}
      </Typography.Paragraph>
    </Layout>
  )
}
