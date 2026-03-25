'use client'

import { Card, Col, Row, Space, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import './HomeHub.css'
import { DiceRoll } from '../DiceRoll/DiceRoll'
import { CardDraw } from '../CardDraw/CardDraw'
import { Layout } from '../Layout/Layout'
import { characterSheetTabHref } from '@/app/characters/[id]/characterSheetRoutes'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import { useLocalize } from '@/app/contexts/LocalizationContext'

const CharacterManager = () => {
  const localize = useLocalize()
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
      title={localize.string('hub.characterCardTitle')}
      extra={
        <BlockedLink href='/characters' className='home-hub__cta'>
          {localize.string('hub.open')}
        </BlockedLink>
      }>
      <p className='home-hub__card-text'>
        {localize.string('hub.characterCardDescription')}
      </p>
      <Row style={{ marginTop: 16 }} gutter={16}>
        {recentCharacters.map(character => (
          <Col span={8} key={character.id}>
            <BlockedLink
              key={character.id}
              href={characterSheetTabHref(character.id, 'identity')}
              className='home-hub__recent-link'>
              <Card
                size='small'
                hoverable
                title={
                  <>
                    {character.gender
                      ? genderCompactSymbol(character.gender)
                      : ''}{' '}
                    {character.name || localize.string('characters.unnamed')},{' '}
                    {localize.string(`archetypes.${character.archetype}`)}
                  </>
                }>
                <Typography.Text type='secondary'>
                  {localize.string('characters.updatedLine', {
                    value:
                      localize.date(character.updatedAt, {
                        dateStyle: 'medium',
                      }) ?? '',
                  })}
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
  const localize = useLocalize()
  return (
    <Card
      className='home-hub__card'
      title={localize.string('hub.inhabitantCardTitle')}
      extra={
        <BlockedLink href='/generators/inhabitant' className='home-hub__cta'>
          {localize.string('hub.open')}
        </BlockedLink>
      }>
      <p className='home-hub__card-text'>
        {localize.string('hub.inhabitantCardDescription')}
      </p>
    </Card>
  )
}

const VillageGenerator = () => {
  const localize = useLocalize()
  return (
    <Card
      className='home-hub__card'
      title={localize.string('hub.villageCardTitle')}
      extra={
        <BlockedLink href='/generators/village' className='home-hub__cta'>
          {localize.string('hub.open')}
        </BlockedLink>
      }>
      <p className='home-hub__card-text'>
        {localize.string('hub.villageCardDescription')}
      </p>
    </Card>
  )
}

export function HomeHub() {
  const localize = useLocalize()
  return (
    <Layout
      title={localize.string('hub.title')}
      breadcrumbs={[]}
      pageCoverBiome='giganticGardens'>
      <section className='home-hub__section' data-testid='managers'>
        <h2 className='home-hub__section-title'>
          {localize.string('hub.managersTitle')}
        </h2>
        <Row gutter={16}>
          <Col span={24}>
            <CharacterManager />
          </Col>
        </Row>
      </section>

      <section className='home-hub__section' data-testid='generators'>
        <h2 className='home-hub__section-title'>
          {localize.string('hub.generatorsTitle')}
        </h2>
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
        <h2 className='home-hub__section-title'>
          {localize.string('tools.title')}
        </h2>
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
              title={localize.string('hub.settingsCardTitle')}
              extra={
                <BlockedLink href='/settings' className='home-hub__cta'>
                  {localize.string('hub.open')}
                </BlockedLink>
              }>
              <p className='home-hub__card-text'>
                {localize.string('hub.settingsCardDescription')}
              </p>
            </Card>
          </Col>
        </Row>
      </section>
    </Layout>
  )
}
