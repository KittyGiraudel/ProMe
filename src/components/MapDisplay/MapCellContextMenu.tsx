'use client'

import { ConfigProvider, Dropdown, Modal, Spin } from 'antd'
import { type EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import type { HexCoordinate } from '@/lib/character/types'
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden'
import { useMapCellContextMenuItems } from './mapCellContextMenuItems'
import { useMapActions } from './useMapActions'
import { useMapState } from './useMapState'

const EmojiPicker = dynamic(
  () => import('emoji-picker-react').then(m => m.default),
  {
    ssr: false,
    loading: () => (
      <div className='Map__EmojiPickerLoading'>
        <Spin size='small' />
      </div>
    ),
  }
)

type MapCellContextMenuProps = {
  coord: HexCoordinate
  coordLabel: string
  isReachable: boolean
  label: string
  selectCell: (coord: HexCoordinate) => void
}

function firstGrapheme(value: string): string {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, {
      granularity: 'grapheme',
    })
    const [first] = Array.from(segmenter.segment(value), part => part.segment)
    return first ?? ''
  }
  return Array.from(value).slice(0, 1).join('')
}

export function MapCellContextMenu({
  coord,
  coordLabel,
  isReachable,
  selectCell,
  label,
}: MapCellContextMenuProps) {
  const t = useTranslations()
  const { getCellState } = useMapState()
  const { moveToCell, setIconAt } = useMapActions()
  const biome = getCellState(coord)?.biome
  const { componentDisabled } = ConfigProvider.useConfig()
  const [open, setOpen] = useState(false)
  const [emojiModalOpen, setEmojiModalOpen] = useState(false)
  const { settings } = useSettings()

  const items = useMapCellContextMenuItems({
    setEmojiModalOpen,
    coord,
    isReachable,
  })

  const onEmojiPicked = useCallback(
    (data: EmojiClickData) => {
      setIconAt(coord, firstGrapheme(data.emoji))
      setEmojiModalOpen(false)
    },
    [setIconAt, coord]
  )

  const onDoubleClick = useCallback(() => {
    if (isReachable) moveToCell(coord)
  }, [isReachable, moveToCell, coord])

  return (
    <>
      <Dropdown
        trigger={['click']}
        arrow={{ pointAtCenter: true }}
        disabled={componentDisabled}
        menu={{
          items,
          selectable: true,
          selectedKeys: [biome ? `biome:${biome}` : 'biome:clear'],
        }}
        open={open}
        onOpenChange={setOpen}
        placement='topLeft'
        classNames={{ root: 'Map__DropdownOverlay' }}>
        <button
          type='button'
          onClick={() => selectCell(coord)}
          onDoubleClick={onDoubleClick}
          title={label}
          className='MapHex__Button'
          disabled={componentDisabled}>
          {settings.map.coordinatesDisplay === 'axes' ? (
            <VisuallyHidden>{coordLabel}</VisuallyHidden>
          ) : (
            coordLabel
          )}
        </button>
      </Dropdown>

      <Modal
        open={emojiModalOpen}
        title={t('characters.map.icon_label')}
        footer={null}
        onCancel={() => setEmojiModalOpen(false)}
        destroyOnHidden
        width={360}
        classNames={{ body: 'Map__EmojiModalBody' }}>
        <div className='Map__EmojiPickerWrap'>
          <EmojiPicker
            onEmojiClick={onEmojiPicked}
            theme={Theme.LIGHT}
            emojiStyle={EmojiStyle.NATIVE}
            searchPlaceHolder={t('characters.map.emoji_search_placeholder')}
            width={320}
            height={380}
            previewConfig={{ showPreview: false }}
          />
        </div>
      </Modal>
    </>
  )
}
