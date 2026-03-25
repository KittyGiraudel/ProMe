'use client'

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { App } from 'antd'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
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

export function NpcGeneratorClient({
  initialRoll,
}: {
  initialRoll: InhabitantRoll | null
}) {
  const t = useTranslations()
  const { message } = App.useApp()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const roll = initialRoll

  const pushToRoll = useCallback(
    (nextRoll: InhabitantRoll) => {
      const encoded = encodeInhabitantRoll(nextRoll)
      const qs = searchParams.toString()
      const base = `/generators/npc/${encoded}`
      void router.push(qs ? `${base}?${qs}` : base, { scroll: false })
    },
    [router, searchParams]
  )

  const handleGenerate = useCallback(() => {
    const next = generateInhabitant(t)
    pushToRoll(next)
  }, [pushToRoll, t])

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

  const handleCopyOneLiner = useCallback(async () => {
    if (!roll) return

    // Prefer the already-routed pathname so we include the new URL shape.
    const shareUrl = `${window.location.origin}${pathname}`
    const line =
      t('inhabitant.one_liner', {
        gender: genderCompactSymbol(roll.gender),
        name: roll.name,
        faction: t(`common.factions.${roll.faction}`),
        age: t(`common.age_bands.${getAgeBand(roll)}`),
        personality: t(`common.personalities.${getPersonality(roll)}`),
      }) +
      ' ' +
      shareUrl

    try {
      await navigator.clipboard.writeText(line)
      message.success(t('inhabitant.copy_one_liner_success'))
    } catch {
      message.error(t('inhabitant.copy_one_liner_error'))
    }
  }, [message, pathname, roll, t])

  return (
    <Layout
      title={t('inhabitant.title')}
      pageCoverBiome='fieldSea'
      breadcrumbs={[{ label: t('nav.home_link'), href: '/' }]}
      headerActions={
        <RollActions
          onRoll={handleGenerate}
          label={t('inhabitant.generate')}
          onCopyOneLiner={roll ? handleCopyOneLiner : undefined}
          copyOneLinerLabel={t('inhabitant.copy_one_liner')}
        />
      }>
      <InhabitantSummary
        roll={roll}
        onRerollPart={roll ? handleRerollPart : undefined}
        onSetRoll={roll ? handleSetRoll : undefined}
      />
    </Layout>
  )
}
