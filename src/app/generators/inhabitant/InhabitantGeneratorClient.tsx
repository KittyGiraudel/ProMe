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
} from '@/lib/inhabitant/generate'
import {
  decodeInhabitantRollParam,
  encodeInhabitantRoll,
} from '@/lib/inhabitant/inhabitantUrlCodec'
import { copy } from '@/messages/fr'
import { formatInhabitantCopyOneLiner } from '@/messages/formatCopy'

const INHABITANT_QUERY_KEY = 'i'
const VILLAGE_QUERY_KEY = 'v'
const OWNERS_QUERY_KEY = 'o'
const RACE_QUERY_KEY = 'race'

export function InhabitantGeneratorClient() {
  const { message } = App.useApp()
  const { replaceSearchParams, pathname, searchParams } =
    useReplaceSearchParams()
  const encoded = searchParams.get(INHABITANT_QUERY_KEY)
  const villageV = searchParams.get(VILLAGE_QUERY_KEY)
  const villageO = searchParams.get(OWNERS_QUERY_KEY)
  const villageRaceParam = searchParams.get(RACE_QUERY_KEY)

  const villageBackHref = useMemo(() => {
    if (!villageV || !villageO) return undefined
    const p = new URLSearchParams()
    p.set(VILLAGE_QUERY_KEY, villageV)
    p.set(OWNERS_QUERY_KEY, villageO)
    if (villageRaceParam) p.set(RACE_QUERY_KEY, villageRaceParam)
    return `/generators/village?${p.toString()}`
  }, [villageO, villageRaceParam, villageV])

  const breadcrumbs = useMemo(() => {
    if (!villageBackHref) return undefined
    return [
      { label: copy.nav.homeLink, href: '/' },
      { label: copy.nav.backToVillage, href: villageBackHref },
    ]
  }, [villageBackHref])

  const roll = useMemo(
    () => (encoded ? decodeInhabitantRollParam(encoded) : null),
    [encoded]
  )

  useEffect(() => {
    if (!encoded || roll !== null) return
    replaceSearchParams(p => {
      p.delete(INHABITANT_QUERY_KEY)
    })
  }, [encoded, replaceSearchParams, roll])

  const handleRollAll = useCallback(() => {
    const next = generateInhabitant()
    replaceSearchParams(p => {
      p.set(INHABITANT_QUERY_KEY, encodeInhabitantRoll(next))
    })
  }, [replaceSearchParams])

  const handleRerollPart = useCallback(
    (part: InhabitantRerollPart) => {
      if (!roll) return
      const next = rerollInhabitantPart(roll, part)
      replaceSearchParams(p => {
        p.set(INHABITANT_QUERY_KEY, encodeInhabitantRoll(next))
      })
    },
    [replaceSearchParams, roll]
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
    const line = formatInhabitantCopyOneLiner(roll, shareUrl)
    try {
      await navigator.clipboard.writeText(line)
      message.success(copy.inhabitant.copyOneLinerSuccess)
    } catch {
      message.error(copy.inhabitant.copyOneLinerError)
    }
  }, [message, pathname, roll, searchParams])

  return (
    <Layout
      title={copy.inhabitant.pageTitle}
      description={copy.inhabitant.pageDescription}
      breadcrumbs={breadcrumbs}>
      <RollActions
        onRollAll={handleRollAll}
        label={copy.inhabitant.rollAll}
        onCopyOneLiner={roll ? handleCopyOneLiner : undefined}
        copyOneLinerLabel={copy.inhabitant.copyOneLiner}
      />
      <InhabitantSummary
        roll={roll}
        onRerollPart={roll ? handleRerollPart : undefined}
        onSetRoll={roll ? handleSetRoll : undefined}
      />
    </Layout>
  )
}
