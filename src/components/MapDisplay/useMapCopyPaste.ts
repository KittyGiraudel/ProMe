'use client'

import { ConfigProvider } from 'antd'
import { useEffect, useRef } from 'react'
import type { HexCoordinate } from '@/lib/character/types'
import type { BiomeId } from '@/lib/types'
import { useMapActions } from './useMapActions'
import { useMapState } from './useMapState'

type CellClipboard = {
  icon?: string
  biome?: BiomeId
}

function isInTextField(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false
  const tag = target.tagName.toLowerCase()
  if (tag === 'input' || tag === 'textarea') return true
  if ((target as HTMLElement).isContentEditable) return true
  return false
}

export function useMapCopyPaste({
  selectedCell,
}: {
  selectedCell: HexCoordinate | null
}) {
  const { componentDisabled } = ConfigProvider.useConfig()
  const { getCellState } = useMapState()
  const { setBiomeAt, setIconAt } = useMapActions()
  const clipboard = useRef<CellClipboard | null>(null)

  useEffect(
    function bindDOMEvents() {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!(e.metaKey || e.ctrlKey)) return
        if (e.key !== 'c' && e.key !== 'v') return
        if (isInTextField(e.target)) return
        if (!selectedCell) return

        if (e.key === 'c') {
          e.preventDefault()
          const { icon, biome } = getCellState(selectedCell)
          clipboard.current = { icon, biome }
        } else if (e.key === 'v') {
          if (componentDisabled) return
          if (!clipboard.current) return
          e.preventDefault()
          const { icon, biome } = clipboard.current
          setBiomeAt(selectedCell, biome)
          setIconAt(selectedCell, icon)
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    },
    [componentDisabled, getCellState, selectedCell, setBiomeAt, setIconAt]
  )
}
