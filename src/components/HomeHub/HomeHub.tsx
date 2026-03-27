'use client'

import { Card, Col, Row, Space, Typography } from 'antd'
import { useFormatter, useTranslations } from 'next-intl'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { Layout } from '@/components/Layout/Layout'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import { useRecentCharacters } from './useRecentCharacters'

const CharacterManager = () => {
  const t = useTranslations()
  const format = useFormatter()
  const recentCharacters = useRecentCharacters()

  return (
    <Card
      title={t('home.character_card_title')}
      extra={<BlockedLink href='/characters'>{t('common.open')}</BlockedLink>}>
      <Space orientation='vertical' style={{ width: '100%' }} size='large'>
        <Typography.Text>
          {t('home.character_card_description')}
        </Typography.Text>
        <Row gutter={16}>
          {recentCharacters.map(character => (
            <Col span={8} key={character.id}>
              <BlockedLink
                key={character.id}
                href={`/characters/${character.id}/identity`}>
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
      </Space>
    </Card>
  )
}

const InhabitantGenerator = () => {
  const t = useTranslations()
  return (
    <Card
      title={t('home.inhabitant_card_title')}
      extra={
        <BlockedLink href='/generators/npc'>{t('common.open')}</BlockedLink>
      }>
      <Typography.Text>{t('home.inhabitant_card_description')}</Typography.Text>
    </Card>
  )
}

const VillageGenerator = () => {
  const t = useTranslations()
  return (
    <Card
      title={t('home.village_card_title')}
      extra={
        <BlockedLink href='/generators/village'>{t('common.open')}</BlockedLink>
      }>
      <Typography.Text>{t('home.village_card_description')}</Typography.Text>
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
      <Space orientation='vertical' size='large' style={{ width: '100%' }}>
        <Row gutter={16}>
          <Col span={24}>
            <CharacterManager />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <InhabitantGenerator />
          </Col>
          <Col span={12}>
            <VillageGenerator />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Card
              title={t('home.settings_title')}
              extra={
                <BlockedLink href='/settings'>{t('common.open')}</BlockedLink>
              }>
              <Typography.Text>
                {t('home.settings_description')}
              </Typography.Text>
            </Card>
          </Col>
        </Row>
      </Space>
    </Layout>
  )
}
