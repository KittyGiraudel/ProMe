import ArrowDownOutlined from '@ant-design/icons/lib/icons/ArrowDownOutlined'
import ArrowLeftOutlined from '@ant-design/icons/lib/icons/ArrowLeftOutlined'
import ArrowRightOutlined from '@ant-design/icons/lib/icons/ArrowRightOutlined'
import ArrowUpOutlined from '@ant-design/icons/lib/icons/ArrowUpOutlined'
import { Button, Tag } from 'antd'
import { useTranslations } from 'next-intl'
import { Dispatch, SetStateAction } from 'react'
import { Spacing } from '@/components/Spacing/Spacing'
import { CellCoordinate } from '@/lib/character/types'
import {
  getDisplayedCellLabel,
  getSheetCoordinate,
  SheetCoordinate,
} from '@/lib/map/coordinates'

export function MapSheetNavigation({
  visibleSheet,
  setVisibleSheet,
  isViewingCurrentSheet,
  currentPosition,
}: {
  visibleSheet: SheetCoordinate
  currentPosition: CellCoordinate
  setVisibleSheet: Dispatch<SetStateAction<SheetCoordinate>>
  isViewingCurrentSheet: boolean
}) {
  const t = useTranslations()

  return (
    <Spacing orientation='horizontal' wrap size='small'>
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
        <ArrowUpOutlined />
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
        <ArrowDownOutlined />
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
        <ArrowLeftOutlined />
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
        <ArrowRightOutlined />
      </Button>
      {!isViewingCurrentSheet ? (
        <Button
          htmlType='button'
          disabled={false}
          onClick={() => setVisibleSheet(getSheetCoordinate(currentPosition))}>
          {t('characters.map.center_on_current')}
        </Button>
      ) : null}
    </Spacing>
  )
}
