'use client'

import { Form, Space } from 'antd'
import { randomId } from '@/lib/character/model'
import { InventoryCard } from '@/components/CharacterSheet/InventoryCard'
import { SpellbookCard } from '@/components/CharacterSheet/SpellbookCard'

export function InventorySpellbookTabSection({
  isDead,
  inventoryLimit,
}: {
  isDead: boolean
  inventoryLimit: number
}) {
  return (
    <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
      <Form.List name='inventory'>
        {(fields, { add, remove }) => (
          <InventoryCard
            fields={fields}
            inventoryLimit={inventoryLimit}
            onAddItem={() => {
              if (isDead) return
              add({
                id: randomId(),
                label: '',
                quantity: 1,
                note: '',
              })
            }}
            onRemoveItem={index => {
              if (isDead) return
              remove(index)
            }}
          />
        )}
      </Form.List>
      <Form.List name='spellbook'>
        {(fields, { add, remove }) => (
          <SpellbookCard
            fields={fields}
            onAddSpell={() => {
              if (isDead) return
              add({
                id: randomId(),
                name: '',
                note: '',
              })
            }}
            onRemoveSpell={index => {
              if (isDead) return
              remove(index)
            }}
          />
        )}
      </Form.List>
    </Space>
  )
}
