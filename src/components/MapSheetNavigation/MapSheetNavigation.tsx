import ArrowDownOutlined from '@ant-design/icons/lib/icons/ArrowDownOutlined'
import ArrowLeftOutlined from '@ant-design/icons/lib/icons/ArrowLeftOutlined'
import ArrowRightOutlined from '@ant-design/icons/lib/icons/ArrowRightOutlined'
import ArrowUpOutlined from '@ant-design/icons/lib/icons/ArrowUpOutlined'
import { Button, Tag, Tooltip } from 'antd'
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
    <Spacing orientation='horizontal' wrap size='medium'>
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
      </Spacing>
      <Spacing orientation='horizontal' wrap size='small'>
        <Tooltip title={t('characters.map.sheet_up')}>
          <Button
            htmlType='button'
            disabled={false}
            aria-label={t('characters.map.sheet_up')}
            onClick={() =>
              setVisibleSheet(sheet => ({
                ...sheet,
                sheetR: sheet.sheetR - 1,
              }))
            }
            icon={<ArrowUpOutlined />}
          />
        </Tooltip>
        <Tooltip title={t('characters.map.sheet_down')}>
          <Button
            htmlType='button'
            disabled={false}
            aria-label={t('characters.map.sheet_down')}
            onClick={() =>
              setVisibleSheet(sheet => ({
                ...sheet,
                sheetR: sheet.sheetR + 1,
              }))
            }
            icon={<ArrowDownOutlined />}
          />
        </Tooltip>
        <Tooltip title={t('characters.map.sheet_left')}>
          <Button
            htmlType='button'
            disabled={false}
            aria-label={t('characters.map.sheet_left')}
            onClick={() =>
              setVisibleSheet(sheet => ({
                ...sheet,
                sheetQ: sheet.sheetQ - 1,
              }))
            }
            icon={<ArrowLeftOutlined />}
          />
        </Tooltip>
        <Tooltip title={t('characters.map.sheet_right')}>
          <Button
            htmlType='button'
            disabled={false}
            aria-label={t('characters.map.sheet_right')}
            onClick={() =>
              setVisibleSheet(sheet => ({
                ...sheet,
                sheetQ: sheet.sheetQ + 1,
              }))
            }
            icon={<ArrowRightOutlined />}
          />
        </Tooltip>
        {!isViewingCurrentSheet ? (
          <Button
            htmlType='button'
            disabled={false}
            onClick={() =>
              setVisibleSheet(getSheetCoordinate(currentPosition))
            }>
            {t('characters.map.center_on_current')}
          </Button>
        ) : null}
      </Spacing>
    </Spacing>
  )
}
