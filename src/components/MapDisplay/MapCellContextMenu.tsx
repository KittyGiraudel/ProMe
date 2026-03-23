'use client'

import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { useMemo, useState } from 'react'
import type { BiomeId, HexCoordinate } from '@/lib/playerCharacter/types'
import { BIOME_IDS } from '@/lib/playerCharacter/types'
import { copy } from '@/messages/fr'

const ICON_CHOICES = ['★', '✦', '✪', '⚑', '☠', '☘', '♣', '♠', '♥', '♦'] as const

type MapCellContextMenuProps = {
  coord: HexCoordinate
  isCore: boolean
  title: string
  coordLabel: string
  onSelectCell: (coord: HexCoordinate) => void
  onAssignBiome: (coord: HexCoordinate, biome: BiomeId | undefined) => void
  onMoveTo: (coord: HexCoordinate) => void
  onSetIcon: (coord: HexCoordinate, icon: string | undefined) => void
  onClearCell: (coord: HexCoordinate) => void
}

export function MapCellContextMenu({
  coord,
  isCore,
  title,
  coordLabel,
  onSelectCell,
  onAssignBiome,
  onMoveTo,
  onSetIcon,
  onClearCell,
}: MapCellContextMenuProps) {
  const [open, setOpen] = useState(false)

  const items = useMemo<MenuProps['items']>(() => {
    const baseItems: NonNullable<MenuProps['items']> = [
      {
        key: 'move',
        label: copy.playerCharacters.mapMoveHere,
      },
      {
        key: 'clear',
        label: copy.playerCharacters.mapClearCell,
      },
      {
        key: 'icon',
        label: copy.playerCharacters.mapIconLabel,
        children: [
          ...ICON_CHOICES.map(icon => ({
            key: `icon:${icon}`,
            label: icon,
          })),
          {
            type: 'divider' as const,
          },
          {
            key: 'icon:clear',
            label: copy.playerCharacters.mapClearCell,
          },
        ],
      },
    ]

    if (isCore) {
      return [
        {
          key: 'coord-group',
          type: 'group',
          label: `${copy.playerCharacters.mapSelectedCell}: ${coordLabel}`,
          children: [],
        },
        {
          key: 'core',
          label: copy.playerCharacters.mapCore,
          disabled: true,
        },
        ...baseItems,
      ]
    }

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
            label: copy.playerCharacters.mapBiomes[id],
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
  }, [coordLabel, isCore])

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
    if (key === 'icon:clear') {
      onSetIcon(coord, undefined)
      setOpen(false)
      return
    }
    if (typeof key === 'string' && key.startsWith('icon:')) {
      onSetIcon(coord, key.slice('icon:'.length))
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
    <Dropdown
      trigger={['click']}
      menu={{ items, onClick: onMenuClick }}
      open={open}
      onOpenChange={nextOpen => {
        setOpen(nextOpen)
        if (nextOpen) onSelectCell(coord)
      }}
      placement='topLeft'
      overlayClassName='Map__DropdownOverlay'>
      <button
        type='button'
        onClick={() => onSelectCell(coord)}
        title={title}
        className='Map__Button'
        aria-label={`${title} ${isCore ? copy.playerCharacters.mapCore : copy.playerCharacters.mapCell}`}>
        {coordLabel}
      </button>
    </Dropdown>
  )
}
