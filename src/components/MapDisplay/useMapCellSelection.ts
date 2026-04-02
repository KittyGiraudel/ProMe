import { ConfigProvider } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CellCoordinate } from '@/lib/character/types'
import { isSameCell } from '@/lib/map/coordinates'

export const useCellSelection = () => {
  const { componentDisabled } = ConfigProvider.useConfig()
  const [selectedCell, setSelectedCell] = useState<CellCoordinate | null>(null)

  useEffect(
    function unselectCellOnDisabled() {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear selection when sheet is readonly
      if (componentDisabled) setSelectedCell(null)
    },
    [componentDisabled]
  )

  const toggleSelectCell = useCallback((coord: CellCoordinate) => {
    setSelectedCell(prev => (prev && isSameCell(prev, coord) ? null : coord))
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
