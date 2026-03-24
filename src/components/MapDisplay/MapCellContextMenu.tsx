'use client'

import { ConfigProvider, Dropdown, Modal, Spin } from 'antd'
import type { MenuProps } from 'antd'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import type { BiomeId, HexCoordinate } from '@/lib/character/types'
import { BIOME_IDS } from '@/lib/character/types'
import { copy } from '@/messages/fr'
import { EmojiStyle, Theme, type EmojiClickData } from 'emoji-picker-react'
import { BiomeBubble } from '../BiomeBubble/BiomeBubble'

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
  currentBiome?: BiomeId
  /** True when this cell has a persisted map icon. */
  hasStoredIcon: boolean
  /** True when this cell has any explored state (biome or icon). */
  hasCellContent: boolean
  /** When false, moving the character to this hex is blocked (not adjacent). */
  canMoveHere: boolean
  title: string
  coordLabel: string
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
  onSelectCell,
  onAssignBiome,
  onAssignRandomBiome,
  onMoveTo,
  onSetIcon,
  onClearCell,
}: MapCellContextMenuProps) {
  const { componentDisabled } = ConfigProvider.useConfig()
  const [open, setOpen] = useState(false)
  const [emojiModalOpen, setEmojiModalOpen] = useState(false)
  const selectedBiomeKey = currentBiome
    ? `biome:${currentBiome}`
    : 'biome:clear'

  const items = useMemo<MenuProps['items']>(() => {
    const iconChildren: NonNullable<MenuProps['items']> = [
      {
        key: 'icon-picker',
        label: copy.characters.mapPickEmoji,
      },
      ...(hasStoredIcon
        ? [
            { type: 'divider' as const },
            {
              key: 'icon:clear',
              label: copy.characters.mapClearIcon,
            },
          ]
        : []),
    ]

    const iconSubmenu = {
      key: 'icon',
      label: copy.characters.mapIconLabel,
      children: iconChildren,
    }

    const actionItems: NonNullable<MenuProps['items']> = [
      {
        key: 'move',
        label: copy.characters.mapMoveHere,
        disabled: !canMoveHere,
        title: canMoveHere ? undefined : copy.characters.mapMoveNeighborOnly,
      },
      {
        key: 'clear',
        danger: true,
        label: copy.characters.mapClearCell,
        disabled: !hasCellContent,
      },
    ]

    return [
      {
        key: 'coord-group',
        type: 'group',
        label: `${copy.characters.mapSelectedCell}: ${coordLabel}`,
        children: [],
      },
      {
        key: 'marking-group',
        type: 'group',
        label: copy.characters.mapMenuMarkingGroup,
        children: [
          {
            key: 'biome',
            label: copy.characters.mapBiomeLabel,
            children: [
              ...BIOME_IDS.map(id => ({
                key: `biome:${id}`,
                label: (
                  <span className='Map__BiomeMenuItem'>
                    <BiomeBubble biome={id} />
                    <span>{copy.characters.mapBiomes[id]}</span>
                  </span>
                ),
              })),
              {
                type: 'divider' as const,
              },
              {
                key: 'biome:clear',
                label: (
                  <span className='Map__BiomeMenuItem'>
                    <BiomeBubble biome='unexplored' />
                    <span>{copy.characters.mapUnexplored}</span>
                  </span>
                ),
              },
              {
                key: 'biome:random',
                label: (
                  <span className='Map__BiomeMenuItem'>
                    <BiomeBubble biome='unexplored' />
                    <span>{copy.characters.mapRandomBiome}</span>
                  </span>
                ),
              },
            ],
          },
          iconSubmenu,
        ],
      },
      {
        key: 'actions-group',
        type: 'group',
        label: copy.characters.mapMenuActionsGroup,
        children: [...actionItems],
      },
    ]
  }, [canMoveHere, coordLabel, hasCellContent, hasStoredIcon])

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
        classNames={{ root: 'Map__DropdownOverlay' }}>
        <button
          type='button'
          onClick={() => onSelectCell(coord)}
          onDoubleClick={() => {
            if (!canMoveHere) return
            onMoveTo(coord)
          }}
          title={title}
          className='Map__Button'
          aria-label={`${title} ${copy.characters.mapCell}`}
          disabled={componentDisabled}>
          {coordLabel}
        </button>
      </Dropdown>

      <Modal
        open={emojiModalOpen}
        title={copy.characters.mapIconLabel}
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
            searchPlaceHolder={copy.characters.mapEmojiSearchPlaceholder}
            width={320}
            height={380}
            previewConfig={{ showPreview: false }}
          />
        </div>
      </Modal>
    </>
  )
}
