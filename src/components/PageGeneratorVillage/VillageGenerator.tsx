'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { App, Select, Space, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import type { InhabitantRoll } from '@/lib/inhabitant/generate'
import { generateInhabitantWithFaction } from '@/lib/inhabitant/generate'
import type { Faction } from '@/lib/types'
import { FACTIONS } from '@/lib/types'
import { decodeVillageFactionParam } from '@/lib/village/villageUrlCodec'
import type { VillageRoll } from '@/lib/village/generate'
import {
  generateVillageRoll,
  rerollVillagePrimarySlot,
} from '@/lib/village/generate'
import { generateOwnersForVillage } from '@/lib/village/ownersGenerate'
import { VillageSummary } from '@/components/VillageSummary/VillageSummary'
import { Layout } from '@/components/Layout/Layout'
import { RollActions } from '@/components/RollActions/RollActions'
import { formatVillageOneLiner } from '@/lib/village/formatOneLiner'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { encodeVillageId } from '@/lib/village/villageIdCodec'
import './VillageGenerator.css'

const DEFAULT_VILLAGE_FACTION: Faction = 'bruja'

export function VillageGenerator({
  initialRoll: roll,
  initialOwners: owners,
}: {
  initialRoll: VillageRoll | null
  initialOwners: InhabitantRoll[] | null
}) {
  const t = useTranslations()
  const { message } = App.useApp()
  const router = useRouter()
  const searchParams = useSearchParams()

  const factionEncoded = searchParams.get('f')
  const villageFaction = useMemo<Faction>(
    () => decodeVillageFactionParam(factionEncoded) ?? DEFAULT_VILLAGE_FACTION,
    [factionEncoded]
  )

  const pushVillage = useCallback(
    (
      nextRoll: VillageRoll,
      nextOwners: InhabitantRoll[],
      nextFaction: Faction
    ) => {
      const id = encodeVillageId(nextRoll, nextOwners)
      void router.push(`/generators/village/${id}?f=${nextFaction}`, {
        scroll: false,
      })
    },
    [router]
  )

  // If a user manually loads with mismatched `?f=...`, re-sync owners once.
  useEffect(() => {
    if (!roll || !owners) return
    if (owners.every(o => o.faction === villageFaction)) return
    const freshOwners = generateOwnersForVillage(roll, villageFaction, t)
    pushVillage(roll, freshOwners, villageFaction)
  }, [owners, pushVillage, roll, t, villageFaction])

  const handleGenerate = useCallback(() => {
    const next = generateVillageRoll()
    const nextOwners = generateOwnersForVillage(next, villageFaction, t)
    pushVillage(next, nextOwners, villageFaction)
  }, [pushVillage, t, villageFaction])

  const handleFactionChange = useCallback(
    (nextFaction: Faction) => {
      if (!roll) {
        return router.replace(`/generators/village?f=${nextFaction}`, {
          scroll: false,
        })
      }
      pushVillage(
        roll,
        generateOwnersForVillage(roll, nextFaction, t),
        nextFaction
      )
    },
    [pushVillage, roll, router, t]
  )

  const handleRerollPrimarySlot = useCallback(
    (slotIndex: number) => {
      if (!roll) return
      const next = rerollVillagePrimarySlot(roll, slotIndex)
      const nextOwners = generateOwnersForVillage(next, villageFaction, t)
      pushVillage(next, nextOwners, villageFaction)
    },
    [pushVillage, roll, t, villageFaction]
  )

  const handleRerollOwner = useCallback(
    (ownerIndex: number) => {
      if (!roll || !owners) return
      const nextOwners = owners.slice()
      nextOwners[ownerIndex] = generateInhabitantWithFaction(villageFaction, t)
      pushVillage(roll, nextOwners, villageFaction)
    },
    [owners, pushVillage, roll, t, villageFaction]
  )

  const handleCopyOneLiner = useCallback(async () => {
    if (!roll || !owners) return
    try {
      await navigator.clipboard.writeText(
        formatVillageOneLiner(roll, t, owners)
      )
      message.success(t('village.copy_one_liner_success'))
    } catch {
      message.error(t('village.copy_one_liner_error'))
    }
  }, [message, owners, roll, t])

  const factionOptions = useMemo(
    () =>
      FACTIONS.map(r => ({
        value: r,
        label: t(`common.factions.${r}`),
      })),
    [t]
  )

  return (
    <Layout
      title={t('village.title')}
      bannerBiome='shadowForest'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.village_generator'), path: '/generators/village' },
      ]}
      headerActions={
        <RollActions
          onRoll={handleGenerate}
          label={t('village.generate')}
          onCopyOneLiner={roll && owners ? handleCopyOneLiner : undefined}
          copyOneLinerLabel={t('village.copy_one_liner')}
        />
      }>
      <div className='village-generator__toolbar'>
        <Typography.Text>{t('village.village_faction_label')}</Typography.Text>
        <Select<Faction>
          value={villageFaction}
          onChange={handleFactionChange}
          options={factionOptions}
          style={{ minWidth: 200 }}
          aria-label={t('village.village_faction_label')}
        />
      </div>
      <VillageSummary
        roll={roll}
        owners={owners}
        onRerollPrimarySlot={roll ? handleRerollPrimarySlot : undefined}
        onRerollOwner={roll && owners ? handleRerollOwner : undefined}
      />
      <Typography.Paragraph type='secondary'>
        {t('rulebook.village_footnote')}
      </Typography.Paragraph>
    </Layout>
  )
}
