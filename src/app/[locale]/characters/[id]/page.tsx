import { Col, Row } from 'antd'
import { ActionsCard } from '@/components/ActionsCard/ActionsCard'
import { CardDraw } from '@/components/CardDraw/CardDraw'
import { CharacteristicsCard } from '@/components/CharacteristicsCard/CharacteristicsCard'
import { ClockCard } from '@/components/ClockCard/ClockCard'
import { DiceRoll } from '@/components/DiceRoll/DiceRoll'
import { IdentityCard } from '@/components/IdentityCard/IdentityCard'
import { InventoryCard } from '@/components/InventoryCard/InventoryCard'
import { JournalCard } from '@/components/JournalCard/JournalCard'
import { MapCard } from '@/components/MapCard/MapCard'
import { Spacing } from '@/components/Spacing/Spacing'
import { SpellbookCard } from '@/components/SpellbookCard/SpellbookCard'

export default function CharacterAllPage() {
  return (
    <Spacing>
      <IdentityCard isArchetypeReadonly />
      <CharacteristicsCard />
      <MapCard />
      <ClockCard />
      <JournalCard />
      <InventoryCard />
      <SpellbookCard />
      <Row gutter={[16, 16]} id='tools'>
        <Col xs={24} md={12}>
          <DiceRoll />
        </Col>
        <Col xs={24} md={12}>
          <CardDraw />
        </Col>
      </Row>
      <ActionsCard />
    </Spacing>
  )
}
