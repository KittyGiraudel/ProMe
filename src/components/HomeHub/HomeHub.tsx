'use client'

import { Card, Col, Row, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useFormatter, useTranslations } from 'next-intl'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { getCharacterStore } from '@/lib/character/store'
import type { Character } from '@/lib/character/types'
import { Layout } from '../Layout/Layout'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import './HomeHub.css'

const CharacterManager = () => {
  const t = useTranslations()
  const format = useFormatter()
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
      title={t('home.character_card_title')}
      extra={
        <BlockedLink href='/characters' className='home-hub__cta'>
          {t('common.open')}
        </BlockedLink>
      }>
      <p className='home-hub__card-text'>
        {t('home.character_card_description')}
      </p>
      <Row style={{ marginTop: 16 }} gutter={16}>
        {recentCharacters.map(character => (
          <Col span={8} key={character.id}>
            <BlockedLink
              key={character.id}
              href={`/characters/${character.id}/identity`}
              className='home-hub__recent-link'>
              <Card
                size='small'
                hoverable
                title={
                  <>
                    {character.gender
                      ? genderCompactSymbol(character.gender)
                      : ''}{' '}
                    {character.name || t('characters_list.unnamed')},{' '}
                    {t(`common.archetypes.${character.archetype}`)}
                  </>
                }>
                <Typography.Text type='secondary'>
                  {t('home.updated_line', {
                    value: format.dateTime(new Date(character.updatedAt), {
                      dateStyle: 'medium',
                    }),
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
  const t = useTranslations()
  return (
    <Card
      className='home-hub__card'
      title={t('home.inhabitant_card_title')}
      extra={
        <BlockedLink href='/generators/inhabitant' className='home-hub__cta'>
          {t('common.open')}
        </BlockedLink>
      }>
      <p className='home-hub__card-text'>
        {t('home.inhabitant_card_description')}
      </p>
    </Card>
  )
}

const VillageGenerator = () => {
  const t = useTranslations()
  return (
    <Card
      className='home-hub__card'
      title={t('home.village_card_title')}
      extra={
        <BlockedLink href='/generators/village' className='home-hub__cta'>
          {t('common.open')}
        </BlockedLink>
      }>
      <p className='home-hub__card-text'>
        {t('home.village_card_description')}
      </p>
    </Card>
  )
}

export function HomeHub() {
  const t = useTranslations()

  return (
    <Layout
      title={t('home.title')}
      breadcrumbs={[]}
      pageCoverBiome='giganticGardens'>
      <section className='home-hub__section' data-testid='managers'>
        <h2 className='home-hub__section-title'>{t('home.managers_title')}</h2>
        <Row gutter={16}>
          <Col span={24}>
            <CharacterManager />
          </Col>
        </Row>
      </section>

      <section className='home-hub__section' data-testid='generators'>
        <h2 className='home-hub__section-title'>
          {t('home.generators_title')}
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
        <h2 className='home-hub__section-title'>{t('settings.title')}</h2>
        <Row gutter={16}>
          <Col span={24} style={{ marginTop: 16 }}>
            <Card
              className='home-hub__card'
              title={t('home.settings_title')}
              extra={
                <BlockedLink href='/settings' className='home-hub__cta'>
                  {t('common.open')}
                </BlockedLink>
              }>
              <p className='home-hub__card-text'>
                {t('home.settings_description')}
              </p>
            </Card>
          </Col>
        </Row>
      </section>
    </Layout>
  )
}
