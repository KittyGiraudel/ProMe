'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { App } from 'antd'
import { CharacterSummary } from '@/components/CharacterSummary/CharacterSummary'
import { GeneratorPageShell } from '@/components/GeneratorPageShell/GeneratorPageShell'
import { RollActions } from '@/components/RollActions/RollActions'
import { useReplaceSearchParams } from '@/hooks/useReplaceSearchParams'
import {
  type CharacterRoll,
  type CharacterRerollPart,
  generateCharacter,
  rerollCharacterPart,
} from '@/lib/character/generate'
import {
  decodeCharacterRollParam,
  encodeCharacterRoll,
} from '@/lib/character/characterUrlCodec'
import { copy } from '@/messages/fr'
import { formatCharacterCopyOneLiner } from '@/messages/formatCopy'

const CHARACTER_QUERY_KEY = 'c'

export function CharacterGeneratorClient() {
  const { message } = App.useApp()
  const { replaceSearchParams, pathname, searchParams } =
    useReplaceSearchParams()
  const encoded = searchParams.get(CHARACTER_QUERY_KEY)
  const villageV = searchParams.get('v')
  const villageO = searchParams.get('o')
  const villageRaceParam = searchParams.get('race')

  const villageBackHref = useMemo(() => {
    if (!villageV || !villageO) return undefined
    const p = new URLSearchParams()
    p.set('v', villageV)
    p.set('o', villageO)
    if (villageRaceParam) p.set('race', villageRaceParam)
    return `/generators/village?${p.toString()}`
  }, [villageO, villageRaceParam, villageV])

  const roll = useMemo(
    () => (encoded ? decodeCharacterRollParam(encoded) : null),
    [encoded]
  )

  useEffect(() => {
    if (!encoded || roll !== null) return
    replaceSearchParams(p => {
      p.delete(CHARACTER_QUERY_KEY)
    })
  }, [encoded, replaceSearchParams, roll])

  const handleRollAll = useCallback(() => {
    const next = generateCharacter()
    replaceSearchParams(p => {
      p.set(CHARACTER_QUERY_KEY, encodeCharacterRoll(next))
    })
  }, [replaceSearchParams])

  const handleRerollPart = useCallback(
    (part: CharacterRerollPart) => {
      if (!roll) return
      const next = rerollCharacterPart(roll, part)
      replaceSearchParams(p => {
        p.set(CHARACTER_QUERY_KEY, encodeCharacterRoll(next))
      })
    },
    [replaceSearchParams, roll]
  )

  const handleSetRoll = useCallback(
    (next: CharacterRoll) => {
      replaceSearchParams(p => {
        p.set(CHARACTER_QUERY_KEY, encodeCharacterRoll(next))
      })
    },
    [replaceSearchParams]
  )

  const handleCopyOneLiner = useCallback(async () => {
    if (!roll) return
    const params = new URLSearchParams(searchParams.toString())
    params.set(CHARACTER_QUERY_KEY, encodeCharacterRoll(roll))
    const shareUrl = `${window.location.origin}${pathname}?${params.toString()}`
    const line = formatCharacterCopyOneLiner(roll, shareUrl)
    try {
      await navigator.clipboard.writeText(line)
      message.success(copy.character.copyOneLinerSuccess)
    } catch {
      message.error(copy.character.copyOneLinerError)
    }
  }, [message, pathname, roll, searchParams])

  return (
    <GeneratorPageShell
      title={copy.character.pageTitle}
      description={copy.character.pageDescription}
      backHref='/'
      backLabel={copy.nav.backHome}
      villageBackHref={villageBackHref}>
      <RollActions
        onRollAll={handleRollAll}
        label={copy.character.rollAll}
        onCopyOneLiner={roll ? handleCopyOneLiner : undefined}
        copyOneLinerLabel={copy.character.copyOneLiner}
      />
      <CharacterSummary
        roll={roll}
        onRerollPart={roll ? handleRerollPart : undefined}
        onSetRoll={roll ? handleSetRoll : undefined}
      />
    </GeneratorPageShell>
  )
}
