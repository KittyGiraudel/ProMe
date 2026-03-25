'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { App } from 'antd'
import { InhabitantSummary } from '@/components/InhabitantSummary/InhabitantSummary'
import { Layout } from '@/components/Layout/Layout'
import { RollActions } from '@/components/RollActions/RollActions'
import { useReplaceSearchParams } from '@/hooks/useReplaceSearchParams'
import {
  type InhabitantRoll,
  type InhabitantRerollPart,
  generateInhabitant,
  rerollInhabitantPart,
  getAgeBand,
  getPersonality,
} from '@/lib/inhabitant/generate'
import {
  decodeInhabitantRollParam,
  encodeInhabitantRoll,
} from '@/lib/inhabitant/inhabitantUrlCodec'
import { useLocalize } from '@/app/contexts/LocalizationContext'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'

const INHABITANT_QUERY_KEY = 'i'
const VILLAGE_QUERY_KEY = 'v'
const OWNERS_QUERY_KEY = 'o'
const FACTION_QUERY_KEY = 'f'

export function InhabitantGeneratorClient() {
  const localize = useLocalize()
  const { message } = App.useApp()
  const { replaceSearchParams, pathname, searchParams } =
    useReplaceSearchParams()
  const encoded = searchParams.get(INHABITANT_QUERY_KEY)
  const villageV = searchParams.get(VILLAGE_QUERY_KEY)
  const villageO = searchParams.get(OWNERS_QUERY_KEY)
  const villageFactionParam = searchParams.get(FACTION_QUERY_KEY)

  const villageBackHref = useMemo(() => {
    if (!villageV || !villageO) return undefined
    const p = new URLSearchParams()
    p.set(VILLAGE_QUERY_KEY, villageV)
    p.set(OWNERS_QUERY_KEY, villageO)
    if (villageFactionParam) p.set(FACTION_QUERY_KEY, villageFactionParam)
    return `/generators/village?${p.toString()}`
  }, [villageO, villageFactionParam, villageV])

  const breadcrumbs = useMemo(() => {
    if (!villageBackHref) return undefined
    return [
      { label: localize.string('nav.homeLink'), href: '/' },
      { label: localize.string('nav.backToVillage'), href: villageBackHref },
    ]
  }, [localize, villageBackHref])

  const roll = useMemo(
    () => (encoded ? decodeInhabitantRollParam(encoded, localize) : null),
    [encoded, localize]
  )

  useEffect(() => {
    if (!encoded || roll !== null) return
    replaceSearchParams(p => {
      p.delete(INHABITANT_QUERY_KEY)
    })
  }, [encoded, replaceSearchParams, roll])

  const handleGenerate = useCallback(() => {
    const next = generateInhabitant(localize)
    replaceSearchParams(p => {
      p.set(INHABITANT_QUERY_KEY, encodeInhabitantRoll(next))
    })
  }, [localize, replaceSearchParams])

  const handleRerollPart = useCallback(
    (part: InhabitantRerollPart) => {
      if (!roll) return
      const next = rerollInhabitantPart(roll, part, localize)
      replaceSearchParams(p => {
        p.set(INHABITANT_QUERY_KEY, encodeInhabitantRoll(next))
      })
    },
    [localize, replaceSearchParams, roll]
  )

  const handleSetRoll = useCallback(
    (next: InhabitantRoll) => {
      replaceSearchParams(p => {
        p.set(INHABITANT_QUERY_KEY, encodeInhabitantRoll(next))
      })
    },
    [replaceSearchParams]
  )

  const handleCopyOneLiner = useCallback(async () => {
    if (!roll) return
    const params = new URLSearchParams(searchParams.toString())
    params.set(INHABITANT_QUERY_KEY, encodeInhabitantRoll(roll))
    const shareUrl = `${window.location.origin}${pathname}?${params.toString()}`
    const line =
      localize.string('inhabitant.oneLiner', {
        gender: genderCompactSymbol(roll.gender),
        name: roll.name,
        faction: localize.string(`factions.${roll.faction}`),
        age: localize.string(`ageBands.${getAgeBand(roll)}`),
        personality: localize.string(`personalities.${getPersonality(roll)}`),
      }) +
      ' ' +
      shareUrl
    try {
      await navigator.clipboard.writeText(line)
      message.success(localize.string('inhabitant.copyOneLinerSuccess'))
    } catch {
      message.error(localize.string('inhabitant.copyOneLinerError'))
    }
  }, [localize, message, pathname, roll, searchParams])

  return (
    <Layout
      title={localize.string('inhabitant.pageTitle')}
      pageCoverBiome='fieldSea'
      breadcrumbs={breadcrumbs}
      headerActions={
        <RollActions
          onRoll={handleGenerate}
          label={localize.string('inhabitant.generate')}
          onCopyOneLiner={roll ? handleCopyOneLiner : undefined}
          copyOneLinerLabel={localize.string('inhabitant.copyOneLiner')}
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
