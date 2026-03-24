'use client'

import { Space } from 'antd'
import { ClockCard } from '@/components/CharacterSheet/ClockCard'
import { MapCard } from '@/components/CharacterSheet/MapCard'

export function MapTabSection() {
  return (
    <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
      <MapCard />
      <ClockCard />
    </Space>
  )
}
