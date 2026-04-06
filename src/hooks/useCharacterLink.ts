import { useParams } from 'next/navigation'
import { useCallback } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import {
  CHARACTER_SHEET_TAB_KEYS,
  CharacterSheetTabId,
} from '@/constants/characterSheetRoutes'

type CharacterLinkOptions = {
  characterId?: string
  tabId?: CharacterSheetTabId
  hash?: string
}

type GetterOptionsRequiringTabId = Omit<CharacterLinkOptions, 'tabId'> & {
  tabId: CharacterSheetTabId
}

export function useCharacterLink(options: {
  tabId: CharacterSheetTabId
  hash?: string
}): (options?: CharacterLinkOptions) => string
export function useCharacterLink(options?: {
  hash?: string
}): (options: GetterOptionsRequiringTabId) => string
export function useCharacterLink({
  tabId,
  hash,
}: {
  tabId?: CharacterSheetTabId
  hash?: string
} = {}) {
  const { settings } = useSettings()
  const params = useParams<{ id: string }>()
  const characterId = params?.id
  const singlePageMode = settings.sheet.singlePageMode

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

      const requestedTab = CHARACTER_SHEET_TAB_KEYS.find(
        tab => tab.id === resolvedTabId
      )!

      const basePath = `/characters/${resolvedCharacterId}`

      // If a hash is provided, we need to handle it like this:
      // - In SPM: just point to it. The referenced ID exists somewhere on the page,
      //   so just keep it as is.
      // - In MPM: use the right tab, *and* preserve the hash.
      if (resolvedHash)
        return singlePageMode
          ? `${basePath}#${resolvedHash}`
          : `${basePath}/${requestedTab.path}#${resolvedHash}`

      // Otherwise if there is no provided hash:
      // - In SPM: reference the right section using an anchor.
      // - In MPM: use the right tab.
      return singlePageMode
        ? `${basePath}#${requestedTab.path}`
        : `${basePath}/${requestedTab.path}`
    },
    [characterId, tabId, hash, singlePageMode]
  )

  return getCharacterLink
}
