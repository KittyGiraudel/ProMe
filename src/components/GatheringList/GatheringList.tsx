'use client'

import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Button, Tooltip } from 'antd'
import { useTranslations } from 'next-intl'
import { DICE } from '@/constants/misc'
import {
  useWatchedInventory,
  useWatchedMoney,
} from '@/hooks/useCharacterSheetDerived'
import { useNotify } from '@/hooks/useNotify'
import { parseGatheringItem } from '@/lib/gathering/parseGatheringItem'
import type { GatherableBiomeId } from '@/lib/gathering/schema'
import { GATHERING_SCHEMA } from '@/lib/gathering/schema'

import './GatheringList.css'

const ROLLS = ['1', '2', '3', '4', '5', '6'] as const

export function GatheringList({ biome }: { biome: GatherableBiomeId }) {
  const t = useTranslations()
  const notification = useNotify()
  const { incrementMoney } = useWatchedMoney()
  const {
    inventory: currentInventory,
    limit: inventoryLimit,
    addItem,
  } = useWatchedInventory()
  const schema = GATHERING_SCHEMA[biome]!
  const isInventoryFull =
    inventoryLimit > 0 && currentInventory.length >= inventoryLimit

  function handleCollect(roll: (typeof ROLLS)[number]) {
    const entry = schema![roll]
    if (entry.type !== 'collectible' && entry.type !== 'money') return

    const text = t(`common.gathering.${biome}.${roll}`)
    if (!text.trim()) return

    const { quantity, label } = parseGatheringItem(text, entry.regex)
    if (entry.type === 'money') incrementMoney(quantity)
    else addItem(quantity, label)

    notification.open({
      title: t('characters.map.gathering_collected'),
      description: `${quantity} × ${label}`,
      placement: 'topRight',
      duration: 5,
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
