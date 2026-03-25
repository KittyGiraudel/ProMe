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
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import { useTranslations } from 'next-intl'

const INHABITANT_QUERY_KEY = 'i'
const VILLAGE_QUERY_KEY = 'v'
const OWNERS_QUERY_KEY = 'o'
const FACTION_QUERY_KEY = 'f'

export function InhabitantGeneratorClient() {
  const t = useTranslations()
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
      { label: t('nav.home_link'), href: '/' },
      { label: t('nav.back_to_village'), href: villageBackHref },
    ]
  }, [t, villageBackHref])

  const roll = useMemo(
    () => (encoded ? decodeInhabitantRollParam(encoded, t) : null),
    [encoded, t]
  )

  useEffect(() => {
    if (!encoded || roll !== null) return
    replaceSearchParams(p => {
      p.delete(INHABITANT_QUERY_KEY)
    })
  }, [encoded, replaceSearchParams, roll])

  const handleGenerate = useCallback(() => {
    const next = generateInhabitant(t)
    replaceSearchParams(p => {
      p.set(INHABITANT_QUERY_KEY, encodeInhabitantRoll(next))
    })
  }, [t, replaceSearchParams])

  const handleRerollPart = useCallback(
    (part: InhabitantRerollPart) => {
      if (!roll) return
      const next = rerollInhabitantPart(roll, part, t)
      replaceSearchParams(p => {
        p.set(INHABITANT_QUERY_KEY, encodeInhabitantRoll(next))
      })
    },
    [t, replaceSearchParams, roll]
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
  }, [t, message, pathname, roll, searchParams])

  return (
    <Layout
      title={t('inhabitant.title')}
      pageCoverBiome='fieldSea'
      breadcrumbs={breadcrumbs}
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
