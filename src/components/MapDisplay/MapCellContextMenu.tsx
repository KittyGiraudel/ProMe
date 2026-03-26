'use client'

import { ConfigProvider, Dropdown, Modal, Spin } from 'antd'
import type { MenuProps } from 'antd'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { BiomeId, HexCoordinate } from '@/lib/character/types'
import { EmojiStyle, Theme, type EmojiClickData } from 'emoji-picker-react'
import { useTranslations } from 'next-intl'
import type { JournalEntryLink } from '@/lib/journal/cellReferenceIndex'
import { useRouter } from '@/i18n/navigation'
import { useMapCellContextMenuItems } from './mapCellContextMenuItems'

const EmojiPicker = dynamic(
  () => import('emoji-picker-react').then(m => m.default),
  {
    ssr: false,
    loading: () => (
      <div className='MapDisplay__EmojiPickerLoading'>
        <Spin size='small' />
      </div>
    ),
  }
)

type MapCellContextMenuProps = {
  coord: HexCoordinate
  currentBiome?: BiomeId
  /** True when this cell has a persisted map icon. */
  hasStoredIcon: boolean
  /** True when this cell has any explored state (biome or icon). */
  hasCellContent: boolean
  /** When false, moving the character to this hex is blocked (not adjacent). */
  canMoveHere: boolean
  title: string
  coordLabel: string
  journalLinks: JournalEntryLink[]
  onSelectCell: (coord: HexCoordinate) => void
  onAssignBiome: (coord: HexCoordinate, biome: BiomeId | undefined) => void
  onAssignRandomBiome: (coord: HexCoordinate) => void
  onMoveTo: (coord: HexCoordinate) => void
  onSetIcon: (coord: HexCoordinate, icon: string | undefined) => void
  onClearCell: (coord: HexCoordinate) => void
}

function firstGrapheme(value: string): string {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    const [first] = Array.from(segmenter.segment(value), part => part.segment)
    return first ?? ''
  }
  return Array.from(value).slice(0, 1).join('')
}

export function MapCellContextMenu({
  coord,
  currentBiome,
  hasStoredIcon,
  hasCellContent,
  canMoveHere,
  title,
  coordLabel,
  journalLinks,
  onSelectCell,
  onAssignBiome,
  onAssignRandomBiome,
  onMoveTo,
  onSetIcon,
  onClearCell,
}: MapCellContextMenuProps) {
  const t = useTranslations()
  const router = useRouter()
  const { componentDisabled } = ConfigProvider.useConfig()
  const [open, setOpen] = useState(false)
  const [emojiModalOpen, setEmojiModalOpen] = useState(false)
  const selectedBiomeKey = currentBiome
    ? `biome:${currentBiome}`
    : 'biome:clear'

  const items = useMapCellContextMenuItems({
    coordLabel,
    canMoveHere,
    hasCellContent,
    hasStoredIcon,
    journalLinks,
  })

  const onEmojiPicked = (data: EmojiClickData) => {
    onSetIcon(coord, firstGrapheme(data.emoji))
    setEmojiModalOpen(false)
  }

  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'move') {
      if (canMoveHere) {
        onMoveTo(coord)
        setOpen(false)
      }
      return
    }
    if (key === 'clear') {
      onClearCell(coord)
      setOpen(false)
      return
    }
    if (typeof key === 'string' && key.startsWith('journal:')) {
      const entryId = key.slice('journal:'.length)
      if (!entryId || entryId === 'overflow') return
      setOpen(false)
      void router.push(`./journal#journal-entry-${entryId}`)
      return
    }
    if (key === 'icon-picker') {
      setOpen(false)
      setEmojiModalOpen(true)
      return
    }
    if (key === 'icon:clear') {
      onSetIcon(coord, undefined)
      setOpen(false)
      return
    }
    if (typeof key === 'string' && key.startsWith('biome:')) {
      const biomeValue = key.slice('biome:'.length)
      if (biomeValue === 'random') {
        onAssignRandomBiome(coord)
        setOpen(false)
        return
      }
      if (biomeValue === 'clear') onAssignBiome(coord, undefined)
      else onAssignBiome(coord, biomeValue as BiomeId)
      setOpen(false)
    }
  }

  return (
    <>
      <Dropdown
        trigger={['contextMenu']}
        disabled={componentDisabled}
        menu={{
          items,
          onClick: onMenuClick,
          selectable: true,
          selectedKeys: [selectedBiomeKey],
        }}
        open={open}
        onOpenChange={setOpen}
        placement='topLeft'
        classNames={{ root: 'MapDisplay__DropdownOverlay' }}>
        <button
          type='button'
          onClick={() => onSelectCell(coord)}
          onDoubleClick={() => {
            if (!canMoveHere) return
            onMoveTo(coord)
          }}
          title={title}
          className='MapDisplay__Button'
          aria-label={`${title} ${t('characters.map.cell')}`}
          disabled={componentDisabled}>
          {coordLabel}
        </button>
      </Dropdown>

      <Modal
        open={emojiModalOpen}
        title={t('characters.map.icon_label')}
        footer={null}
        onCancel={() => setEmojiModalOpen(false)}
        destroyOnHidden
        width={360}
        classNames={{ body: 'MapDisplay__EmojiModalBody' }}>
        <div className='MapDisplay__EmojiPickerWrap'>
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
