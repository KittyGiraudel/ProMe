'use client'

import { Card, Col, Row, Typography } from 'antd'
import { useFormatter, useTranslations } from 'next-intl'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { Layout } from '@/components/Layout/Layout'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import { useRecentCharacters } from './useRecentCharacters'
import './HomeHub.css'

const CharacterManager = () => {
  const t = useTranslations()
  const format = useFormatter()
  const recentCharacters = useRecentCharacters()

  return (
    <Card
      className='HomeHub__card'
      title={t('home.character_card_title')}
      extra={
        <BlockedLink href='/characters' className='HomeHub__cta'>
          {t('common.open')}
        </BlockedLink>
      }>
      <p className='HomeHub__card-text'>
        {t('home.character_card_description')}
      </p>
      <Row style={{ marginTop: 16 }} gutter={16}>
        {recentCharacters.map(character => (
          <Col span={8} key={character.id}>
            <BlockedLink
              key={character.id}
              href={`/characters/${character.id}/identity`}
              className='HomeHub__recent-link'>
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
      className='HomeHub__card'
      title={t('home.inhabitant_card_title')}
      extra={
        <BlockedLink href='/generators/npc' className='HomeHub__cta'>
          {t('common.open')}
        </BlockedLink>
      }>
      <p className='HomeHub__card-text'>
        {t('home.inhabitant_card_description')}
      </p>
    </Card>
  )
}

const VillageGenerator = () => {
  const t = useTranslations()
  return (
    <Card
      className='HomeHub__card'
      title={t('home.village_card_title')}
      extra={
        <BlockedLink href='/generators/village' className='HomeHub__cta'>
          {t('common.open')}
        </BlockedLink>
      }>
      <p className='HomeHub__card-text'>{t('home.village_card_description')}</p>
    </Card>
  )
}

export function HomeHub() {
  const t = useTranslations()

  return (
    <Layout
      title={t('home.title')}
      breadcrumbs={[]}
      bannerBiome='giganticGardens'>
      <section className='HomeHub__section' data-testid='managers'>
        <h2 className='HomeHub__section-title'>{t('home.managers_title')}</h2>
        <Row gutter={16}>
          <Col span={24}>
            <CharacterManager />
          </Col>
        </Row>
      </section>

      <section className='HomeHub__section' data-testid='generators'>
        <h2 className='HomeHub__section-title'>{t('home.generators_title')}</h2>
        <Row gutter={16}>
          <Col span={12}>
            <InhabitantGenerator />
          </Col>
          <Col span={12}>
            <VillageGenerator />
          </Col>
        </Row>
      </section>

      <section className='HomeHub__section' data-testid='tools'>
        <h2 className='HomeHub__section-title'>{t('settings.title')}</h2>
        <Row gutter={16}>
          <Col span={24} style={{ marginTop: 16 }}>
            <Card
              className='HomeHub__card'
              title={t('home.settings_title')}
              extra={
                <BlockedLink href='/settings' className='HomeHub__cta'>
                  {t('common.open')}
                </BlockedLink>
              }>
              <p className='HomeHub__card-text'>
                {t('home.settings_description')}
              </p>
            </Card>
          </Col>
        </Row>
      </section>
    </Layout>
  )
}
