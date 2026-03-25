'use client'

import { Space } from 'antd'
import { IdentityCard } from '@/components/CharacterSheet/IdentityCard'
import { CharacteristicsCard } from '@/components/CharacterSheet/CharacteristicsCard'

export function IdentityTabSection() {
  return (
    <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
      <IdentityCard isArchetypeReadonly />
      <CharacteristicsCard />
    </Space>
  )
}
