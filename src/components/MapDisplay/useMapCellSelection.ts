import { ConfigProvider } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { HexCoordinate } from '@/lib/character/types'
import { isSameHex } from '@/lib/hex/coordinates'

export const useCellSelection = () => {
  const { componentDisabled } = ConfigProvider.useConfig()
  const [selectedCell, setSelectedCell] = useState<HexCoordinate | null>(null)

  useEffect(
    function unselectCellOnDisabled() {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear selection when sheet is readonly
      if (componentDisabled) setSelectedCell(null)
    },
    [componentDisabled]
  )

  const toggleSelectCell = useCallback((coord: HexCoordinate) => {
    setSelectedCell(prev => (prev && isSameHex(prev, coord) ? null : coord))
  }, [])

  return useMemo(
    () => ({
      setSelectedCell,
      selectedCell,
      toggleSelectCell,
    }),
    [setSelectedCell, selectedCell, toggleSelectCell]
  )
}
