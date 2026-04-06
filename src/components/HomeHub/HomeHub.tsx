'use client'

import { Card, Col, Row, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { LastCharacters } from '@/components/LastCharacters/LastCharacters'
import { Layout } from '@/components/Layout/Layout'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { Spacing } from '@/components/Spacing/Spacing'

const CharacterManager = () => {
  const t = useTranslations()

  return (
    <Card
      title={t('home.character_card_title')}
      extra={
        <BlockedLink href='/characters'>{t('common.actions.open')}</BlockedLink>
      }>
      <Spacing>
        <Typography.Text>
          {t('home.character_card_description')}
        </Typography.Text>
        <LastCharacters />
      </Spacing>
    </Card>
  )
}

const InhabitantGenerator = () => {
  const t = useTranslations()
  return (
    <Card
      title={t('home.inhabitant_card_title')}
      extra={
        <BlockedLink href='/generators/npc'>
          {t('common.actions.open')}
        </BlockedLink>
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
        <BlockedLink href='/generators/village'>
          {t('common.actions.open')}
        </BlockedLink>
      }>
      <Typography.Text>{t('home.village_card_description')}</Typography.Text>
    </Card>
  )
}

export function HomeHub() {
  const t = useTranslations()

  return (
    <Layout title={t('home.title')} breadcrumbs={[]} bannerBiome='fieldSea'>
      <Row gutter={16}>
        <Col span={24}>
          <CharacterManager />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <InhabitantGenerator />
        </Col>
        <Col xs={24} md={12}>
          <VillageGenerator />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title={t('home.settings_title')}
            extra={
              <BlockedLink href='/settings'>
                {t('common.actions.open')}
              </BlockedLink>
            }>
            <Typography.Text>{t('home.settings_description')}</Typography.Text>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            title={t('home.faq_title')}
            extra={
              <BlockedLink href='/faq'>{t('common.actions.open')}</BlockedLink>
            }>
            <Typography.Text>{t('home.faq_description')}</Typography.Text>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}
