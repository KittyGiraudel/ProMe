'use client'

import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { App, Button, Tooltip } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { useCharacterContext } from '@/components/PageCharacterSheet/CharacterContext'
import {
  useWatchedInventory,
  useWatchedStats,
} from '@/components/PageCharacterSheet/useCharacterSheetDerived'
import { randomId } from '@/lib/character/model'
import { DICE } from '@/lib/constants/misc'
import { parseGatheringItem } from '@/lib/gathering/parseGatheringItem'
import type { GatherableBiomeId } from '@/lib/gathering/schema'
import { GATHERING_SCHEMA } from '@/lib/gathering/schema'

import './GatheringList.css'

const ROLLS = ['1', '2', '3', '4', '5', '6'] as const

export function GatheringList({ biome }: { biome: GatherableBiomeId }) {
  const t = useTranslations()
  const { notification } = App.useApp()
  const { setCharacterValue } = useCharacterContext()
  const { money } = useWatchedStats()
  const { inventory: currentInventory, limit: inventoryLimit } =
    useWatchedInventory()
  const schema = GATHERING_SCHEMA[biome]!
  const isInventoryFull =
    inventoryLimit > 0 && currentInventory.length >= inventoryLimit

  const addMoney = useCallback(
    (quantity: number) => setCharacterValue('money', money + quantity),
    [setCharacterValue, money]
  )

  const addCollectible = useCallback(
    (quantity: number, label: string) => {
      const existing = currentInventory.find(
        item => item.label.toLowerCase() === label.toLowerCase()
      )
      if (existing) {
        setCharacterValue(
          'inventory',
          currentInventory.map(item =>
            item === existing
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        )
      } else {
        if (inventoryLimit > 0 && currentInventory.length >= inventoryLimit)
          return
        setCharacterValue('inventory', [
          ...currentInventory,
          { id: randomId(), quantity, label, note: '' },
        ])
      }
    },
    [setCharacterValue, inventoryLimit, currentInventory]
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
      {ROLLS.map((roll, index) => {
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
        const face = DICE[index]

        return (
          <li key={roll} className='GatheringList__item' data-index={face}>
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
