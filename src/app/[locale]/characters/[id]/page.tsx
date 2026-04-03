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
      <section id='identity'>
        <Spacing>
          <IdentityCard isArchetypeReadonly />
          <CharacteristicsCard />
        </Spacing>
      </section>
      <section id='map'>
        <Spacing>
          <MapCard />
          <ClockCard />
        </Spacing>
      </section>
      <section id='journal'>
        <JournalCard />
      </section>
      <section id='inventory'>
        <Spacing>
          <InventoryCard />
          <SpellbookCard />
        </Spacing>
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
    </Spacing>
  )
}
