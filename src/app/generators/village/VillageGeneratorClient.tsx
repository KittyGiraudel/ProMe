'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { App } from 'antd'
import { GeneratorPageShell } from '@/components/GeneratorPageShell/GeneratorPageShell'
import { RollActions } from '@/components/RollActions/RollActions'
import { VillageSummary } from '@/components/VillageSummary/VillageSummary'
import {
  generateVillageRoll,
  rerollVillagePrimarySlot,
} from '@/lib/lsdp/village/generate'
import {
  decodeVillageRollParam,
  encodeVillageRoll,
} from '@/lib/lsdp/village/villageUrlCodec'
import { formatVillageCopyOneLiner, fr } from '@/messages/fr'

const VILLAGE_QUERY_KEY = 'v'

export function VillageGeneratorClient() {
  const { message } = App.useApp()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const encoded = searchParams.get(VILLAGE_QUERY_KEY)

  const roll = useMemo(
    () => (encoded ? decodeVillageRollParam(encoded) : null),
    [encoded]
  )

  useEffect(() => {
    if (!encoded || roll !== null) return
    const params = new URLSearchParams(searchParams.toString())
    params.delete(VILLAGE_QUERY_KEY)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [encoded, pathname, roll, router, searchParams])

  const handleRollAll = useCallback(() => {
    const next = generateVillageRoll()
    const params = new URLSearchParams(searchParams.toString())
    params.set(VILLAGE_QUERY_KEY, encodeVillageRoll(next))
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, searchParams])

  const handleRerollSlot = useCallback(
    (slotIndex: number) => {
      if (!roll) return
      const next = rerollVillagePrimarySlot(roll, slotIndex)
      const params = new URLSearchParams(searchParams.toString())
      params.set(VILLAGE_QUERY_KEY, encodeVillageRoll(next))
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, roll, router, searchParams]
  )

  const handleCopyOneLiner = useCallback(async () => {
    if (!roll) return
    const params = new URLSearchParams(searchParams.toString())
    params.set(VILLAGE_QUERY_KEY, encodeVillageRoll(roll))
    const shareUrl = `${window.location.origin}${pathname}?${params.toString()}`
    const line = formatVillageCopyOneLiner(roll, shareUrl)
    try {
      await navigator.clipboard.writeText(line)
      message.success(fr.village.copyOneLinerSuccess)
    } catch {
      message.error(fr.village.copyOneLinerError)
    }
  }, [message, pathname, roll, searchParams])

  return (
    <GeneratorPageShell
      title={fr.village.pageTitle}
      description={fr.village.pageDescription}
      backHref='/'
      backLabel={fr.nav.backHome}>
      <RollActions
        onRollAll={handleRollAll}
        label={fr.village.rollAll}
        onCopyOneLiner={roll ? handleCopyOneLiner : undefined}
        copyOneLinerLabel={fr.village.copyOneLiner}
      />
      <VillageSummary
        roll={roll}
        onRerollPrimarySlot={roll ? handleRerollSlot : undefined}
      />
    </GeneratorPageShell>
  )
}
