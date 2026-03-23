'use client'

import { Dropdown, Modal, Spin } from 'antd'
import type { MenuProps } from 'antd'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import type { BiomeId, HexCoordinate } from '@/lib/playerCharacter/types'
import { BIOME_IDS } from '@/lib/playerCharacter/types'
import { copy } from '@/messages/fr'
import { EmojiStyle, Theme, type EmojiClickData } from 'emoji-picker-react'

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
  /** True when this cell has a persisted map icon. */
  hasStoredIcon: boolean
  title: string
  coordLabel: string
  onSelectCell: (coord: HexCoordinate) => void
  onAssignBiome: (coord: HexCoordinate, biome: BiomeId | undefined) => void
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
  hasStoredIcon,
  title,
  coordLabel,
  onSelectCell,
  onAssignBiome,
  onMoveTo,
  onSetIcon,
  onClearCell,
}: MapCellContextMenuProps) {
  const [open, setOpen] = useState(false)
  const [emojiModalOpen, setEmojiModalOpen] = useState(false)

  const items = useMemo<MenuProps['items']>(() => {
    const iconChildren: NonNullable<MenuProps['items']> = [
      {
        key: 'icon-picker',
        label: copy.playerCharacters.mapPickEmoji,
      },
      ...(hasStoredIcon
        ? [
            { type: 'divider' as const },
            {
              key: 'icon:clear',
              label: copy.playerCharacters.mapClearIcon,
            },
          ]
        : []),
    ]

    const iconSubmenu = {
      key: 'icon',
      label: copy.playerCharacters.mapIconLabel,
      children: iconChildren,
    }

    const baseItems: NonNullable<MenuProps['items']> = [
      {
        key: 'move',
        label: copy.playerCharacters.mapMoveHere,
      },
      {
        key: 'clear',
        label: copy.playerCharacters.mapClearCell,
      },
      iconSubmenu,
    ]

    return [
      {
        key: 'coord-group',
        type: 'group',
        label: `${copy.playerCharacters.mapSelectedCell}: ${coordLabel}`,
        children: [],
      },
      {
        key: 'biome',
        label: copy.playerCharacters.mapBiomeLabel,
        children: [
          ...BIOME_IDS.map(id => ({
            key: `biome:${id}`,
            label: (
              <span className='Map__BiomeMenuItem'>
                <span data-biome={id} className='Map__BiomeSwatch' />
                <span>{copy.playerCharacters.mapBiomes[id]}</span>
              </span>
            ),
          })),
          {
            type: 'divider' as const,
          },
          {
            key: 'biome:clear',
            label: copy.playerCharacters.mapUnexplored,
          },
        ],
      },
      ...baseItems,
    ]
  }, [coordLabel, hasStoredIcon])

  const onEmojiPicked = (data: EmojiClickData) => {
    onSetIcon(coord, firstGrapheme(data.emoji))
    setEmojiModalOpen(false)
  }

  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'move') {
      onMoveTo(coord)
      setOpen(false)
      return
    }
    if (key === 'clear') {
      onClearCell(coord)
      setOpen(false)
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
      if (biomeValue === 'clear') onAssignBiome(coord, undefined)
      else onAssignBiome(coord, biomeValue as BiomeId)
      setOpen(false)
    }
  }

  return (
    <>
      <Dropdown
        trigger={['click']}
        menu={{ items, onClick: onMenuClick }}
        open={open}
        onOpenChange={nextOpen => {
          setOpen(nextOpen)
          if (nextOpen) onSelectCell(coord)
        }}
        placement='topLeft'
        classNames={{ root: 'Map__DropdownOverlay' }}>
        <button
          type='button'
          onClick={() => onSelectCell(coord)}
          title={title}
          className='Map__Button'
          aria-label={`${title} ${copy.playerCharacters.mapCell}`}>
          {coordLabel}
        </button>
      </Dropdown>

      <Modal
        open={emojiModalOpen}
        title={copy.playerCharacters.mapIconLabel}
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
            searchPlaceHolder={copy.playerCharacters.mapEmojiSearchPlaceholder}
            width={320}
            height={380}
            previewConfig={{ showPreview: false }}
          />
        </div>
      </Modal>
    </>
  )
}
