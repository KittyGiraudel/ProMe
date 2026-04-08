'use client'

import { useParams } from 'next/navigation'
import { useCallback } from 'react'

type CharacterLinkOptions = {
  characterId?: string
  tabId?: string
  hash?: string
}

type GetterOptionsRequiringTabId = Omit<CharacterLinkOptions, 'tabId'> & {
  tabId: string
}

export function useCharacterLink(options: {
  tabId: string
  hash?: string
}): (options?: CharacterLinkOptions) => string
export function useCharacterLink(options?: {
  hash?: string
}): (options: GetterOptionsRequiringTabId) => string
export function useCharacterLink({
  tabId,
  hash,
}: {
  tabId?: string
  hash?: string
} = {}) {
  const params = useParams<{ id: string }>()
  const characterId = params?.id

  const getCharacterLink = useCallback(
    ({
      characterId: oCharacterId,
      tabId: oTabId,
      hash: oHash,
    }: CharacterLinkOptions = {}) => {
      const resolvedCharacterId = oCharacterId ?? characterId
      const resolvedTabId = oTabId ?? tabId
      const resolvedHash = (oHash ?? hash ?? '').replace('#', '')

      if (!resolvedCharacterId) {
        throw new Error('Missing character ID for character sheet link.')
      }

      const basePath = `/characters/${resolvedCharacterId}`

      if (resolvedHash) return `${basePath}#${resolvedHash}`
      if (resolvedTabId) return `${basePath}#${resolvedTabId}`
      return basePath
    },
    [characterId, tabId, hash]
  )

  return getCharacterLink
}
