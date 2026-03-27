import { Space, Tag, Button } from 'antd'
import {
  getDisplayedCellLabel,
  getSheetCoordinate,
  SheetCoordinate,
} from '@/lib/hex/coordinates'
import { useTranslations } from 'next-intl'
import { HexCoordinate } from '@/lib/character/types'
import { Dispatch, SetStateAction } from 'react'

export function MapSheetNavigation({
  visibleSheet,
  setVisibleSheet,
  isViewingCurrentSheet,
  currentPosition,
}: {
  visibleSheet: SheetCoordinate
  currentPosition: HexCoordinate
  setVisibleSheet: Dispatch<SetStateAction<SheetCoordinate>>
  isViewingCurrentSheet: boolean
}) {
  const t = useTranslations()

  return (
    <Space wrap>
      <Tag>
        {t('characters.map.sheet', {
          sheetQ: visibleSheet.sheetQ,
          sheetR: visibleSheet.sheetR,
        })}
      </Tag>
      <Tag>
        {t('characters.map.character_position', {
          position: getDisplayedCellLabel(currentPosition),
        })}
      </Tag>
      <Button
        htmlType='button'
        disabled={false}
        onClick={() =>
          setVisibleSheet(sheet => ({
            ...sheet,
            sheetR: sheet.sheetR - 1,
          }))
        }>
        ↑
      </Button>
      <Button
        htmlType='button'
        disabled={false}
        onClick={() =>
          setVisibleSheet(sheet => ({
            ...sheet,
            sheetR: sheet.sheetR + 1,
          }))
        }>
        ↓
      </Button>
      <Button
        htmlType='button'
        disabled={false}
        onClick={() =>
          setVisibleSheet(sheet => ({
            ...sheet,
            sheetQ: sheet.sheetQ - 1,
          }))
        }>
        ←
      </Button>
      <Button
        htmlType='button'
        disabled={false}
        onClick={() =>
          setVisibleSheet(sheet => ({
            ...sheet,
            sheetQ: sheet.sheetQ + 1,
          }))
        }>
        →
      </Button>
      {!isViewingCurrentSheet ? (
        <Button
          htmlType='button'
          disabled={false}
          onClick={() => setVisibleSheet(getSheetCoordinate(currentPosition))}>
          {t('characters.map.center_on_current')}
        </Button>
      ) : null}
    </Space>
  )
}
