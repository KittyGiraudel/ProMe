'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CharacterSummary } from '@/components/CharacterSummary/CharacterSummary'
import { GeneratorPageShell } from '@/components/GeneratorPageShell/GeneratorPageShell'
import { RollActions } from '@/components/RollActions/RollActions'
import {
  type CharacterRerollPart,
  generateCharacter,
  rerollCharacterPart,
} from '@/lib/lsdp/character/generate'
import {
  decodeCharacterRollParam,
  encodeCharacterRoll,
} from '@/lib/lsdp/character/characterUrlCodec'
import { fr } from '@/messages/fr'

const CHARACTER_QUERY_KEY = 'c'

export function CharacterGeneratorClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const encoded = searchParams.get(CHARACTER_QUERY_KEY)

  const roll = useMemo(
    () => (encoded ? decodeCharacterRollParam(encoded) : null),
    [encoded]
  )

  useEffect(() => {
    if (!encoded || roll !== null) return
    const params = new URLSearchParams(searchParams.toString())
    params.delete(CHARACTER_QUERY_KEY)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [encoded, pathname, roll, router, searchParams])

  const handleRollAll = useCallback(() => {
    const next = generateCharacter()
    const params = new URLSearchParams(searchParams.toString())
    params.set(CHARACTER_QUERY_KEY, encodeCharacterRoll(next))
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, searchParams])

  const handleRerollPart = useCallback(
    (part: CharacterRerollPart) => {
      if (!roll) return
      const next = rerollCharacterPart(roll, part)
      const params = new URLSearchParams(searchParams.toString())
      params.set(CHARACTER_QUERY_KEY, encodeCharacterRoll(next))
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, roll, router, searchParams]
  )

  return (
    <GeneratorPageShell
      title={fr.character.pageTitle}
      description={fr.character.pageDescription}
      backHref='/'
      backLabel={fr.nav.backHome}>
      <RollActions onRollAll={handleRollAll} label={fr.character.rollAll} />
      <CharacterSummary
        roll={roll}
        onRerollPart={roll ? handleRerollPart : undefined}
      />
    </GeneratorPageShell>
  )
}
