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
  const currentMoney = getCharacterValue<number>('money') ?? 0
  const currentInventory = getCharacterValue<InventoryItem[]>('inventory') ?? []
  const isInventoryFull =
    inventoryLimit > 0 && currentInventory.length >= inventoryLimit

  const addMoney = useCallback(
    (quantity: number) => setCharacterValue('money', currentMoney + quantity),
    [currentMoney, setCharacterValue]
  )

  const addCollectible = useCallback(
    (quantity: number, label: string) => {
      if (isInventoryFull) return
      setCharacterValue('inventory', [
        ...currentInventory,
        { id: randomId(), quantity, label, note: '' },
      ])
    },
    [getCharacterValue, setCharacterValue, currentInventory, isInventoryFull]
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
        return (
          <li key={roll} className='GatheringList__item' data-index={roll}>
            {t(`common.gathering.${biome}.${roll}`)}
            {(entry.type === 'collectible' || entry.type === 'money') && (
              <Tooltip
                title={
                  entry.type === 'collectible' && isInventoryFull
                    ? t('characters.inventory.inventory_full')
                    : t('common.actions.collect')
                }>
                <Button
                  type='text'
                  size='small'
                  icon={<PlusOutlined />}
                  htmlType='button'
                  disabled={entry.type === 'collectible' && isInventoryFull}
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
