'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { App, Select, Typography } from 'antd'
import { Layout } from '@/components/Layout/Layout'
import { RollActions } from '@/components/RollActions/RollActions'
import { VillageSummary } from '@/components/VillageSummary/VillageSummary'
import { useReplaceSearchParams } from '@/hooks/useReplaceSearchParams'
import { encodeInhabitantRoll } from '@/lib/inhabitant/inhabitantUrlCodec'
import {
  generateInhabitantWithFaction,
  type InhabitantRoll,
} from '@/lib/inhabitant/generate'
import type { Faction } from '@/lib/types'
import { FACTIONS } from '@/lib/types'
import {
  generateVillageRoll,
  rerollVillagePrimarySlot,
  type VillageRoll,
} from '@/lib/village/generate'
import {
  decodeVillageFactionParam,
  decodeVillageRollParam,
  encodeVillageRoll,
  encodeVillageOwners,
  decodeVillageOwnersParam,
} from '@/lib/village/villageUrlCodec'
import { useVillageGenerator } from './useVillageGenerator'
import './VillageGeneratorClient.css'
import { formatVillageOneLiner } from '@/lib/village/formatOneLiner'
import { useTranslations } from 'next-intl'

const VILLAGE_QUERY_KEY = 'v'
const OWNERS_QUERY_KEY = 'o'
const FACTION_QUERY_KEY = 'f'

const DEFAULT_VILLAGE_FACTION: Faction = 'bruja'

export function VillageGeneratorClient() {
  const t = useTranslations()
  const { generateOwnersForVillage, countVillageOwnerSlots } =
    useVillageGenerator()
  const { message } = App.useApp()
  const { replaceSearchParams, pathname, searchParams } =
    useReplaceSearchParams()
  const encoded = searchParams.get(VILLAGE_QUERY_KEY)
  const ownersEncoded = searchParams.get(OWNERS_QUERY_KEY)
  const factionEncoded = searchParams.get(FACTION_QUERY_KEY)

  const roll = useMemo(
    () => (encoded ? decodeVillageRollParam(encoded) : null),
    [encoded]
  )

  const ownersDecoded = useMemo(() => {
    if (!roll || !ownersEncoded) return null
    const n = countVillageOwnerSlots(roll)
    const list = decodeVillageOwnersParam(t, ownersEncoded)
    if (!list || list.length !== n) return null
    return list
  }, [roll, ownersEncoded, t, countVillageOwnerSlots])

  const factionInferredFromOwners = useMemo((): Faction | null => {
    if (!ownersDecoded?.length) return null
    const r = ownersDecoded[0]!.faction
    return ownersDecoded.every(o => o.faction === r) ? r : null
  }, [ownersDecoded])

  const villageFaction = useMemo(() => {
    const fromParam = decodeVillageFactionParam(factionEncoded)
    if (fromParam !== null) return fromParam
    if (factionInferredFromOwners !== null) return factionInferredFromOwners
    return DEFAULT_VILLAGE_FACTION
  }, [factionEncoded, factionInferredFromOwners])

  const ownersValid = useMemo(() => {
    if (!ownersDecoded) return null
    if (!ownersDecoded.every(o => o.faction === villageFaction)) return null
    return ownersDecoded
  }, [ownersDecoded, villageFaction])

  useEffect(() => {
    if (factionEncoded === null) return
    if (decodeVillageFactionParam(factionEncoded) !== null) return
    replaceSearchParams(p => {
      p.delete(FACTION_QUERY_KEY)
    })
  }, [factionEncoded, replaceSearchParams])

  useEffect(() => {
    if (!roll || !ownersValid) return
    if (factionEncoded !== null) return
    replaceSearchParams(p => {
      p.set(FACTION_QUERY_KEY, villageFaction)
    })
  }, [ownersValid, factionEncoded, replaceSearchParams, roll, villageFaction])

  useEffect(() => {
    if (!encoded || roll !== null) return
    replaceSearchParams(p => {
      p.delete(VILLAGE_QUERY_KEY)
      p.delete(OWNERS_QUERY_KEY)
    })
  }, [encoded, replaceSearchParams, roll])

  useEffect(() => {
    if (!roll) return
    if (ownersValid !== null) return
    const fresh = generateOwnersForVillage(roll, villageFaction)
    replaceSearchParams(p => {
      p.set(VILLAGE_QUERY_KEY, encodeVillageRoll(roll))
      p.set(OWNERS_QUERY_KEY, encodeVillageOwners(fresh))
      p.set(FACTION_QUERY_KEY, villageFaction)
    })
  }, [ownersValid, replaceSearchParams, roll, villageFaction])

  const pushVillageParams = useCallback(
    (
      nextRoll: VillageRoll,
      nextOwners: InhabitantRoll[],
      nextFaction: Faction
    ) => {
      replaceSearchParams(p => {
        p.set(VILLAGE_QUERY_KEY, encodeVillageRoll(nextRoll))
        p.set(OWNERS_QUERY_KEY, encodeVillageOwners(nextOwners))
        p.set(FACTION_QUERY_KEY, nextFaction)
      })
    },
    [replaceSearchParams]
  )

  const handleGenerate = useCallback(() => {
    const next = generateVillageRoll()
    const owners = generateOwnersForVillage(next, villageFaction)
    pushVillageParams(next, owners, villageFaction)
  }, [pushVillageParams, villageFaction, generateOwnersForVillage])

  const handleFactionChange = useCallback(
    (nextFaction: Faction) => {
      if (!roll) {
        replaceSearchParams(p => {
          p.set(FACTION_QUERY_KEY, nextFaction)
        })
        return
      }
      const owners = generateOwnersForVillage(roll, nextFaction)
      pushVillageParams(roll, owners, nextFaction)
    },
    [pushVillageParams, replaceSearchParams, roll, generateOwnersForVillage]
  )

  const handleRerollSlot = useCallback(
    (slotIndex: number) => {
      if (!roll) return
      const next = rerollVillagePrimarySlot(roll, slotIndex)
      const owners = generateOwnersForVillage(next, villageFaction)
      pushVillageParams(next, owners, villageFaction)
    },
    [pushVillageParams, roll, villageFaction, generateOwnersForVillage]
  )

  const handleRerollOwner = useCallback(
    (ownerIndex: number) => {
      if (!roll || !ownersValid) return
      const nextOwners = ownersValid.slice()
      nextOwners[ownerIndex] = generateInhabitantWithFaction(villageFaction, t)
      pushVillageParams(roll, nextOwners, villageFaction)
    },
    [t, ownersValid, pushVillageParams, roll, villageFaction]
  )

  const handleCopyOneLiner = useCallback(async () => {
    if (!roll || !ownersValid) return
    const params = new URLSearchParams(searchParams.toString())
    params.set(VILLAGE_QUERY_KEY, encodeVillageRoll(roll))
    params.set(OWNERS_QUERY_KEY, encodeVillageOwners(ownersValid))
    params.set(FACTION_QUERY_KEY, villageFaction)
    const shareUrl = `${window.location.origin}${pathname}?${params.toString()}`
    const line = formatVillageOneLiner(roll, shareUrl, t, ownersValid, {
      inhabitantShareUrl: inhabitantRoll => {
        const p = new URLSearchParams()
        p.set('i', encodeInhabitantRoll(inhabitantRoll))
        p.set(VILLAGE_QUERY_KEY, encodeVillageRoll(roll))
        p.set(OWNERS_QUERY_KEY, encodeVillageOwners(ownersValid))
        p.set(FACTION_QUERY_KEY, villageFaction)
        return `${window.location.origin}/generators/inhabitant?${p.toString()}`
      },
    })
    try {
      await navigator.clipboard.writeText(line)
      message.success(t('village.copy_one_liner_success'))
    } catch {
      message.error(t('village.copy_one_liner_error'))
    }
  }, [t, message, ownersValid, pathname, roll, searchParams, villageFaction])

  const factionOptions = useMemo(
    () =>
      FACTIONS.map(r => ({
        value: r,
        label: t(`common.factions.${r}`),
      })),
    [t]
  )

  const inhabitantPageVillageQuery = useMemo(() => {
    if (!roll || !ownersValid) return null
    const p = new URLSearchParams()
    p.set(VILLAGE_QUERY_KEY, encodeVillageRoll(roll))
    p.set(OWNERS_QUERY_KEY, encodeVillageOwners(ownersValid))
    p.set(FACTION_QUERY_KEY, villageFaction)
    return p.toString()
  }, [ownersValid, roll, villageFaction])

  return (
    <Layout
      title={t('village.title')}
      pageCoverBiome='shadowForest'
      headerActions={
        <RollActions
          onRoll={handleGenerate}
          label={t('village.generate')}
          onCopyOneLiner={roll && ownersValid ? handleCopyOneLiner : undefined}
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
        owners={ownersValid}
        inhabitantPageVillageQuery={inhabitantPageVillageQuery}
        onRerollPrimarySlot={roll ? handleRerollSlot : undefined}
        onRerollOwner={roll && ownersValid ? handleRerollOwner : undefined}
      />
    </Layout>
  )
}
