import { Col, Row, Space } from 'antd'
import { ActionsCard } from '@/components/ActionsCard/ActionsCard'
import { CardDraw } from '@/components/CardDraw/CardDraw'
import { CharacteristicsCard } from '@/components/CharacteristicsCard/CharacteristicsCard'
import { ClockCard } from '@/components/ClockCard/ClockCard'
import { DiceRoll } from '@/components/DiceRoll/DiceRoll'
import { IdentityCard } from '@/components/IdentityCard/IdentityCard'
import { InventoryCard } from '@/components/InventoryCard/InventoryCard'
import { JournalCard } from '@/components/JournalCard/JournalCard'
import { MapCard } from '@/components/MapCard/MapCard'
import { SpellbookCard } from '@/components/SpellbookCard/SpellbookCard'

export default function CharacterAllPage() {
  return (
    <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
      <section id='identity'>
        <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
          <IdentityCard isArchetypeReadonly />
          <CharacteristicsCard />
        </Space>
      </section>
      <section id='map'>
        <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
          <MapCard />
          <ClockCard />
        </Space>
      </section>
      <section id='journal'>
        <JournalCard />
      </section>
      <section id='inventory'>
        <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
          <InventoryCard />
          <SpellbookCard />
        </Space>
      </section>
      <section id='tools'>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <DiceRoll />
          </Col>
          <Col xs={24} md={12}>
            <CardDraw />
          </Col>
        </Row>
      </section>
      <section id='actions'>
        <ActionsCard />
      </section>
    </Space>
  )
}
