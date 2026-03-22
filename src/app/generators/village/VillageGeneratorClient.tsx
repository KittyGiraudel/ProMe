'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { App, Select, Typography } from 'antd'
import { GeneratorPageShell } from '@/components/GeneratorPageShell/GeneratorPageShell'
import { RollActions } from '@/components/RollActions/RollActions'
import { VillageSummary } from '@/components/VillageSummary/VillageSummary'
import { useReplaceSearchParams } from '@/hooks/useReplaceSearchParams'
import { encodeCharacterRoll } from '@/lib/character/characterUrlCodec'
import {
  generateCharacterWithRace,
  type CharacterRoll,
} from '@/lib/character/generate'
import type { Race } from '@/lib/types'
import { RACES } from '@/lib/types'
import {
  generateVillageRoll,
  rerollVillagePrimarySlot,
  type VillageRoll,
} from '@/lib/village/generate'
import { generateOwnersForVillage } from '@/lib/village/ownersGenerate'
import { countVillageEstablishments } from '@/lib/village/resolveDisplay'
import { decodeVillageRaceParam } from '@/lib/village/villageRaceCodec'
import {
  decodeVillageRollParam,
  encodeVillageRoll,
} from '@/lib/village/villageUrlCodec'
import {
  decodeVillageOwnersParam,
  encodeVillageOwners,
} from '@/lib/village/villageOwnersCodec'
import { copy } from '@/messages/fr'
import { formatVillageCopyOneLiner } from '@/messages/formatCopy'
import './VillageGeneratorClient.css'

const VILLAGE_QUERY_KEY = 'v'
const OWNERS_QUERY_KEY = 'o'
const RACE_QUERY_KEY = 'race'

const DEFAULT_VILLAGE_RACE: Race = 'bruja'

export function VillageGeneratorClient() {
  const { message } = App.useApp()
  const { replaceSearchParams, pathname, searchParams } =
    useReplaceSearchParams()
  const encoded = searchParams.get(VILLAGE_QUERY_KEY)
  const ownersEncoded = searchParams.get(OWNERS_QUERY_KEY)
  const raceEncoded = searchParams.get(RACE_QUERY_KEY)

  const roll = useMemo(
    () => (encoded ? decodeVillageRollParam(encoded) : null),
    [encoded]
  )

  const ownersDecoded = useMemo(() => {
    if (!roll || !ownersEncoded) return null
    const n = countVillageEstablishments(roll)
    const list = decodeVillageOwnersParam(ownersEncoded)
    if (!list || list.length !== n) return null
    return list
  }, [roll, ownersEncoded])

  const raceInferredFromOwners = useMemo((): Race | null => {
    if (!ownersDecoded?.length) return null
    const r = ownersDecoded[0]!.race
    return ownersDecoded.every(o => o.race === r) ? r : null
  }, [ownersDecoded])

  const villageRace = useMemo(() => {
    const fromParam = decodeVillageRaceParam(raceEncoded)
    if (fromParam !== null) return fromParam
    if (raceInferredFromOwners !== null) return raceInferredFromOwners
    return DEFAULT_VILLAGE_RACE
  }, [raceEncoded, raceInferredFromOwners])

  const ownersValid = useMemo(() => {
    if (!ownersDecoded) return null
    if (!ownersDecoded.every(o => o.race === villageRace)) return null
    return ownersDecoded
  }, [ownersDecoded, villageRace])

  useEffect(() => {
    if (raceEncoded === null) return
    if (decodeVillageRaceParam(raceEncoded) !== null) return
    replaceSearchParams(p => {
      p.delete(RACE_QUERY_KEY)
    })
  }, [raceEncoded, replaceSearchParams])

  useEffect(() => {
    if (!roll || !ownersValid) return
    if (raceEncoded !== null) return
    replaceSearchParams(p => {
      p.set(RACE_QUERY_KEY, villageRace)
    })
  }, [ownersValid, raceEncoded, replaceSearchParams, roll, villageRace])

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
    const fresh = generateOwnersForVillage(roll, villageRace)
    replaceSearchParams(p => {
      p.set(VILLAGE_QUERY_KEY, encodeVillageRoll(roll))
      p.set(OWNERS_QUERY_KEY, encodeVillageOwners(fresh))
      p.set(RACE_QUERY_KEY, villageRace)
    })
  }, [ownersValid, replaceSearchParams, roll, villageRace])

  const pushVillageParams = useCallback(
    (nextRoll: VillageRoll, nextOwners: CharacterRoll[], nextRace: Race) => {
      replaceSearchParams(p => {
        p.set(VILLAGE_QUERY_KEY, encodeVillageRoll(nextRoll))
        p.set(OWNERS_QUERY_KEY, encodeVillageOwners(nextOwners))
        p.set(RACE_QUERY_KEY, nextRace)
      })
    },
    [replaceSearchParams]
  )

  const handleRollAll = useCallback(() => {
    const next = generateVillageRoll()
    const owners = generateOwnersForVillage(next, villageRace)
    pushVillageParams(next, owners, villageRace)
  }, [pushVillageParams, villageRace])

  const handleRaceChange = useCallback(
    (nextRace: Race) => {
      if (!roll) {
        replaceSearchParams(p => {
          p.set(RACE_QUERY_KEY, nextRace)
        })
        return
      }
      const owners = generateOwnersForVillage(roll, nextRace)
      pushVillageParams(roll, owners, nextRace)
    },
    [pushVillageParams, replaceSearchParams, roll]
  )

  const handleRerollSlot = useCallback(
    (slotIndex: number) => {
      if (!roll) return
      const next = rerollVillagePrimarySlot(roll, slotIndex)
      const owners = generateOwnersForVillage(next, villageRace)
      pushVillageParams(next, owners, villageRace)
    },
    [pushVillageParams, roll, villageRace]
  )

  const handleRerollOwner = useCallback(
    (ownerIndex: number) => {
      if (!roll || !ownersValid) return
      const nextOwners = ownersValid.slice()
      nextOwners[ownerIndex] = generateCharacterWithRace(villageRace)
      pushVillageParams(roll, nextOwners, villageRace)
    },
    [ownersValid, pushVillageParams, roll, villageRace]
  )

  const handleCopyOneLiner = useCallback(async () => {
    if (!roll || !ownersValid) return
    const params = new URLSearchParams(searchParams.toString())
    params.set(VILLAGE_QUERY_KEY, encodeVillageRoll(roll))
    params.set(OWNERS_QUERY_KEY, encodeVillageOwners(ownersValid))
    params.set(RACE_QUERY_KEY, villageRace)
    const shareUrl = `${window.location.origin}${pathname}?${params.toString()}`
    const line = formatVillageCopyOneLiner(roll, shareUrl, ownersValid, {
      characterShareUrl: characterRoll =>
        `${window.location.origin}/generators/character?c=${encodeURIComponent(encodeCharacterRoll(characterRoll))}`,
    })
    try {
      await navigator.clipboard.writeText(line)
      message.success(copy.village.copyOneLinerSuccess)
    } catch {
      message.error(copy.village.copyOneLinerError)
    }
  }, [message, ownersValid, pathname, roll, searchParams, villageRace])

  const raceOptions = useMemo(
    () =>
      RACES.map(r => ({
        value: r,
        label: copy.races[r],
      })),
    []
  )

  return (
    <GeneratorPageShell
      title={copy.village.pageTitle}
      description={copy.village.pageDescription}
      backHref='/'
      backLabel={copy.nav.backHome}>
      <div className='village-generator__toolbar'>
        <div className='village-generator__toolbar-actions'>
          <RollActions
            onRollAll={handleRollAll}
            label={copy.village.rollAll}
            onCopyOneLiner={
              roll && ownersValid ? handleCopyOneLiner : undefined
            }
            copyOneLinerLabel={copy.village.copyOneLiner}
          />
        </div>
        <div className='village-generator__race'>
          <Typography.Text>{copy.village.villageRaceLabel}</Typography.Text>
          <Select<Race>
            value={villageRace}
            onChange={handleRaceChange}
            options={raceOptions}
            style={{ minWidth: 200 }}
            aria-label={copy.village.villageRaceLabel}
          />
        </div>
      </div>
      <VillageSummary
        roll={roll}
        owners={ownersValid}
        onRerollPrimarySlot={roll ? handleRerollSlot : undefined}
        onRerollOwner={roll && ownersValid ? handleRerollOwner : undefined}
      />
    </GeneratorPageShell>
  )
}
