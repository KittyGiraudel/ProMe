'use client'

import { Card, Col, Row, Space, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { copy } from '@/messages/fr'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import './HomeHub.css'
import { DiceRoll } from '../DiceRoll/DiceRoll'
import { CardDraw } from '../CardDraw/CardDraw'
import { Layout } from '../Layout/Layout'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'

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
    title: copy.hub.characterCardTitle,
    description: copy.hub.characterCardDescription,
  },
] as const

const CharacterManager = () => {
  const store = useMemo(() => getCharacterStore(), [])
  const [recentCharacters, setRecentCharacters] = useState<Character[]>([])

  useEffect(() => {
    const latest = [...store.list()]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 3)
    setRecentCharacters(latest)
  }, [store])

  return (
    <Card
      className='home-hub__card'
      title={copy.hub.characterCardTitle}
      extra={
        <BlockedLink href='/characters' className='home-hub__cta'>
          {copy.hub.open}
        </BlockedLink>
      }>
      <p className='home-hub__card-text'>{copy.hub.characterCardDescription}</p>
      <Row style={{ marginTop: 16 }} gutter={16}>
        {recentCharacters.map(character => (
          <Col span={8} key={character.id}>
            <BlockedLink
              key={character.id}
              href={`/characters/${character.id}`}
              className='home-hub__recent-link'>
              <Card
                size='small'
                hoverable
                title={
                  <>
                    {character.gender
                      ? genderCompactSymbol(character.gender)
                      : ''}{' '}
                    {character.name || copy.characters.unnamed},{' '}
                    {copy.characters.archetypes[character.archetype]}
                  </>
                }>
                <Typography.Text type='secondary'>
                  {copy.characters.updatedLabel}:{' '}
                  {new Date(character.updatedAt).toLocaleDateString('fr-FR')}
                </Typography.Text>
              </Card>
            </BlockedLink>
          </Col>
        ))}
      </Row>
    </Card>
  )
}

const InhabitantGenerator = () => {
  return (
    <Card
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
      <section className='home-hub__section' data-testid='managers'>
        <h2 className='home-hub__section-title'>{copy.hub.managersTitle}</h2>
        <Row gutter={16}>
          <Col span={24}>
            <CharacterManager />
          </Col>
        </Row>
      </section>

      <section className='home-hub__section' data-testid='generators'>
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

      <section className='home-hub__section' data-testid='tools'>
        <h2 className='home-hub__section-title'>{copy.hub.quickToolsTitle}</h2>
        <Row gutter={16}>
          <Col span={12}>
            <DiceRoll />
          </Col>
          <Col span={12}>
            <CardDraw />
          </Col>
          <Col span={24} style={{ marginTop: 16 }}>
            <Card
              className='home-hub__card'
              title={copy.hub.settingsCardTitle}
              extra={
                <BlockedLink href='/settings' className='home-hub__cta'>
                  {copy.hub.open}
                </BlockedLink>
              }>
              <p className='home-hub__card-text'>
                {copy.hub.settingsCardDescription}
              </p>
            </Card>
          </Col>
        </Row>
      </section>
    </Layout>
  )
}
