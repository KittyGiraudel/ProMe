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
import { useLocalize } from '@/app/contexts/LocalizationContext'
import { useVillageGenerator } from './useVillageGenerator'
import './VillageGeneratorClient.css'
import { formatVillageOneLiner } from '@/lib/village/formatOneLiner'

const VILLAGE_QUERY_KEY = 'v'
const OWNERS_QUERY_KEY = 'o'
const FACTION_QUERY_KEY = 'f'

const DEFAULT_VILLAGE_FACTION: Faction = 'bruja'

export function VillageGeneratorClient() {
  const localize = useLocalize()
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
    const list = decodeVillageOwnersParam(localize, ownersEncoded)
    if (!list || list.length !== n) return null
    return list
  }, [roll, ownersEncoded, localize, countVillageOwnerSlots])

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
  }, [pushVillageParams, villageFaction])

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
    [pushVillageParams, replaceSearchParams, roll]
  )

  const handleRerollSlot = useCallback(
    (slotIndex: number) => {
      if (!roll) return
      const next = rerollVillagePrimarySlot(roll, slotIndex)
      const owners = generateOwnersForVillage(next, villageFaction)
      pushVillageParams(next, owners, villageFaction)
    },
    [pushVillageParams, roll, villageFaction]
  )

  const handleRerollOwner = useCallback(
    (ownerIndex: number) => {
      if (!roll || !ownersValid) return
      const nextOwners = ownersValid.slice()
      nextOwners[ownerIndex] = generateInhabitantWithFaction(
        villageFaction,
        localize
      )
      pushVillageParams(roll, nextOwners, villageFaction)
    },
    [ownersValid, pushVillageParams, roll, villageFaction]
  )

  const handleCopyOneLiner = useCallback(async () => {
    if (!roll || !ownersValid) return
    const params = new URLSearchParams(searchParams.toString())
    params.set(VILLAGE_QUERY_KEY, encodeVillageRoll(roll))
    params.set(OWNERS_QUERY_KEY, encodeVillageOwners(ownersValid))
    params.set(FACTION_QUERY_KEY, villageFaction)
    const shareUrl = `${window.location.origin}${pathname}?${params.toString()}`
    const line = formatVillageOneLiner(roll, shareUrl, localize, ownersValid, {
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
      message.success(localize.string('village.copyOneLinerSuccess'))
    } catch {
      message.error(localize.string('village.copyOneLinerError'))
    }
  }, [message, ownersValid, pathname, roll, searchParams, villageFaction])

  const factionOptions = useMemo(
    () =>
      FACTIONS.map(r => ({
        value: r,
        label: localize.string(`factions.${r}`),
      })),
    []
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
      title={localize.string('village.pageTitle')}
      pageCoverBiome='shadowForest'
      headerActions={
        <RollActions
          onRoll={handleGenerate}
          label={localize.string('village.generate')}
          onCopyOneLiner={roll && ownersValid ? handleCopyOneLiner : undefined}
          copyOneLinerLabel={localize.string('village.copyOneLiner')}
        />
      }>
      <div className='village-generator__toolbar'>
        <Typography.Text>
          {localize.string('village.villageFactionLabel')}
        </Typography.Text>
        <Select<Faction>
          value={villageFaction}
          onChange={handleFactionChange}
          options={factionOptions}
          style={{ minWidth: 200 }}
          aria-label={localize.string('village.villageFactionLabel')}
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
