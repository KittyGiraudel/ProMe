'use client'

import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { App, Button, Empty, Tooltip } from 'antd'
import { useTranslations } from 'next-intl'
import { useCharacterContext } from '@/components/PageCharacterSheet/CharacterContext'
import { useInventoryLimit } from '@/components/PageCharacterSheet/useInventoryLimit'
import { randomId } from '@/lib/character/model'
import type { InventoryItem } from '@/lib/character/types'
import { parseGatheringItem } from '@/lib/gathering/parseGatheringItem'
import type { GatherableBiomeId } from '@/lib/gathering/schema'
import { GATHERING_SCHEMA } from '@/lib/gathering/schema'
import './GatheringList.css'
import { useCallback } from 'react'

const ROLLS = ['1', '2', '3', '4', '5', '6'] as const

export function GatheringList({ biome }: { biome: GatherableBiomeId }) {
  const t = useTranslations()
  const { notification } = App.useApp()
  const { getCharacterValue, setCharacterValue } = useCharacterContext()
  const inventoryLimit = useInventoryLimit()
  const schema = GATHERING_SCHEMA[biome]!
  // Read at render time for display only — callbacks read fresh to avoid stale closures
  const currentInventory = getCharacterValue<InventoryItem[]>('inventory') ?? []
  const isInventoryFull =
    inventoryLimit > 0 && currentInventory.length >= inventoryLimit

  const addMoney = useCallback(
    (quantity: number) => {
      const current = getCharacterValue<number>('money') ?? 0
      setCharacterValue('money', current + quantity)
    },
    [getCharacterValue, setCharacterValue]
  )

  const addCollectible = useCallback(
    (quantity: number, label: string) => {
      const inventory = getCharacterValue<InventoryItem[]>('inventory') ?? []
      const existing = inventory.find(
        item => item.label.toLowerCase() === label.toLowerCase()
      )
      if (existing) {
        setCharacterValue(
          'inventory',
          inventory.map(item =>
            item === existing
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        )
      } else {
        if (inventoryLimit > 0 && inventory.length >= inventoryLimit) return
        setCharacterValue('inventory', [
          ...inventory,
          { id: randomId(), quantity, label, note: '' },
        ])
      }
    },
    [getCharacterValue, setCharacterValue, inventoryLimit]
  )

  function handleCollect(roll: (typeof ROLLS)[number]) {
    const entry = schema![roll]
    if (entry.type !== 'collectible' && entry.type !== 'money') return

    const text = t(`common.gathering.${biome}.${roll}`)
    if (!text.trim()) return

    const { quantity, label } = parseGatheringItem(text, entry.regex)
    if (entry.type === 'money') addMoney(quantity)
    else addCollectible(quantity, label)

    notification.open({
      title: t('characters.map.gathering_collected'),
      description: `${quantity} × ${label}`,
      placement: 'bottomRight',
    })
  }

  return (
    <ol className='GatheringList'>
      {ROLLS.map(roll => {
        const entry = schema[roll]
        const text = t(`common.gathering.${biome}.${roll}`)
        const hasExisting =
          entry.type === 'collectible' &&
          currentInventory.some(
            item =>
              item.label.toLowerCase() ===
              parseGatheringItem(text, entry.regex).label.toLowerCase()
          )
        const isDisabled =
          entry.type === 'collectible' && isInventoryFull && !hasExisting
        return (
          <li key={roll} className='GatheringList__item' data-index={roll}>
            {text}
            {(entry.type === 'collectible' || entry.type === 'money') && (
              <Tooltip
                title={
                  isDisabled
                    ? t('characters.inventory.inventory_full')
                    : t('common.actions.collect')
                }>
                <Button
                  type='text'
                  size='small'
                  icon={<PlusOutlined />}
                  htmlType='button'
                  disabled={isDisabled}
                  onClick={() => handleCollect(roll)}
                />
              </Tooltip>
            )}
          </li>
        )
      })}
    </ol>
  )
}
