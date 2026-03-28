import { HexCoordinate } from "@/lib/character/types"
import { isSameHex } from "@/lib/hex/coordinates"
import { ConfigProvider } from "antd"
import { useCallback, useEffect, useMemo, useState } from "react"

export const useCellSelection = () => {
  const { componentDisabled } = ConfigProvider.useConfig()
  const [selectedCell, setSelectedCell] = useState<HexCoordinate | null>(null)
  
  useEffect(() => {
    if (!componentDisabled) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clear selection when sheet is readonly
    setSelectedCell(null)
  }, [componentDisabled])

  const toggleSelectCell = useCallback((coord: HexCoordinate) => {
    setSelectedCell(prev => (prev && isSameHex(prev, coord) ? null : coord))
  }, [])

  console.log('useCellSelection', { selectedCell })

  return useMemo(() => ({
    setSelectedCell,
    selectedCell,
    toggleSelectCell,
  }), [
    setSelectedCell,
    selectedCell,
    toggleSelectCell
  ])
}
