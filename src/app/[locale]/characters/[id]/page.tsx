import { Col, Row, Space } from 'antd'
import { CardDraw } from '@/components/CardDraw/CardDraw'
import { DiceRoll } from '@/components/DiceRoll/DiceRoll'
import { ActionsCard } from '@/components/PageCharacterSheet/ActionsCard'
import { CharacteristicsCard } from '@/components/PageCharacterSheet/CharacteristicsCard'
import { ClockCard } from '@/components/PageCharacterSheet/ClockCard'
import { IdentityCard } from '@/components/PageCharacterSheet/IdentityCard'
import { InventoryCard } from '@/components/PageCharacterSheet/InventoryCard'
import { JournalCard } from '@/components/PageCharacterSheet/JournalCard'
import { MapCard } from '@/components/PageCharacterSheet/MapCard'
import { SpellbookCard } from '@/components/PageCharacterSheet/SpellbookCard'

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
