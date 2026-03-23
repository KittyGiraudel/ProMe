'use client'

import { Card, Col, Row, Typography } from 'antd'
import { copy } from '@/messages/fr'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import './HomeHub.css'
import { DiceRoll } from '../DiceRoll/DiceRoll'
import { CardDraw } from '../CardDraw/CardDraw'
import { Layout } from '../Layout/Layout'

const generators = [
  {
    href: '/generators/inhabitant',
    title: copy.hub.inhabitantCardTitle,
    description: copy.hub.inhabitantCardDescription,
  },
  {
    href: '/generators/village',
    title: copy.hub.villageCardTitle,
    description: copy.hub.villageCardDescription,
  },
] as const

const managers = [
  {
    href: '/characters',
    title: copy.hub.playerCharacterCardTitle,
    description: copy.hub.playerCharacterCardDescription,
  },
] as const

const CharacterManager = () => {
  return (
    <Card
      hoverable
      className='home-hub__card'
      title={copy.hub.playerCharacterCardTitle}
      extra={
        <BlockedLink href='/characters' className='home-hub__cta'>
          {copy.hub.open}
        </BlockedLink>
      }>
      <p className='home-hub__card-text'>
        {copy.hub.playerCharacterCardDescription}
      </p>
    </Card>
  )
}

const InhabitantGenerator = () => {
  return (
    <Card
      hoverable
      className='home-hub__card'
      title={copy.hub.inhabitantCardTitle}
      extra={
        <BlockedLink href='/generators/inhabitant' className='home-hub__cta'>
          {copy.hub.open}
        </BlockedLink>
      }>
      <p className='home-hub__card-text'>
        {copy.hub.inhabitantCardDescription}
      </p>
    </Card>
  )
}

const VillageGenerator = () => {
  return (
    <Card
      hoverable
      className='home-hub__card'
      title={copy.hub.villageCardTitle}
      extra={
        <BlockedLink href='/generators/village' className='home-hub__cta'>
          {copy.hub.open}
        </BlockedLink>
      }>
      <p className='home-hub__card-text'>{copy.hub.villageCardDescription}</p>
    </Card>
  )
}

export function HomeHub() {
  return (
    <Layout
      title={copy.hub.title}
      description={copy.hub.subtitle}
      breadcrumbs={[]}>
      <section className='home-hub__section'>
        <h2 className='home-hub__section-title'>{copy.hub.managersTitle}</h2>
        <Row gutter={16}>
          <Col span={24}>
            <CharacterManager />
          </Col>
        </Row>
      </section>

      <section className='home-hub__section'>
        <h2 className='home-hub__section-title'>{copy.hub.generatorsTitle}</h2>
        <Row gutter={16}>
          <Col span={12}>
            <InhabitantGenerator />
          </Col>
          <Col span={12}>
            <VillageGenerator />
          </Col>
        </Row>
      </section>

      <section className='home-hub__section'>
        <h2 className='home-hub__section-title'>{copy.hub.quickToolsTitle}</h2>
        <Row gutter={16}>
          <Col span={12}>
            <DiceRoll />
          </Col>
          <Col span={12}>
            <CardDraw />
          </Col>
        </Row>
      </section>
    </Layout>
  )
}
