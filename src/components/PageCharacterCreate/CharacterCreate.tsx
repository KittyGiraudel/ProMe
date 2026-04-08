'use client'

import { Card, Col, Form, Input, Row, Select } from 'antd'
import { useTranslations } from 'next-intl'
import { ArchetypeSelector } from '@/components/ArchetypeSelector/ArchetypeSelector'
import { Button } from '@/components/Button/Button'
import { InheritanceCard } from '@/components/InheritanceCard/InheritanceCard'
import { Layout } from '@/components/Layout/Layout'
import { Spacing } from '@/components/Spacing/Spacing'
import { useCharacterCreate } from '@/hooks/useCharacterCreate'
import { useInheritanceCandidates } from '@/hooks/useInheritanceCandidates'
import type { Archetype } from '@/lib/character/types'
import { GENDERS } from '@/lib/constants/misc'
import type { Gender } from '@/lib/types'
import './CharacterCreate.css'

type CharacterCreateFormValues = {
  name: string
  archetype: Archetype
  gender?: Gender
  inheritFromCharacterId?: string
}

export function CharacterCreate() {
  const t = useTranslations()
  const [form] = Form.useForm<CharacterCreateFormValues>()
  const handleCreate = useCharacterCreate()
  const candidates = useInheritanceCandidates()
  const gender = Form.useWatch('gender', form)

  return (
    <Layout
      title={t('new_character.title')}
      bannerBiome='floodedPlains'
      breadcrumbs={[
        { title: t('nav.home'), path: '/' },
        { title: t('nav.characters'), path: '/characters' },
        { title: t('nav.new_character'), path: '/characters/new' },
      ]}>
      <Form<CharacterCreateFormValues>
        form={form}
        layout='vertical'
        colon={false}
        initialValues={{
          name: '',
          archetype: 'warrior',
          gender: undefined,
          inheritFromCharacterId: undefined,
        }}
        onFinish={handleCreate}>
        <Spacing>
          <Card title={t('characters.identity.identity_section')} id='identity'>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={16}>
                <Form.Item
                  rules={[{ required: true }]}
                  name='name'
                  label={t('characters.identity.name_label')}
                  className='CharacterCreate__FormItem'>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name='gender'
                  label={t('characters.identity.gender_label')}
                  className='CharacterCreate__FormItem'>
                  <Select
                    allowClear
                    className='CharacterCreate__GenderSelect'
                    options={GENDERS.map(gender => ({
                      value: gender,
                      label: t(`common.genders.${gender}`),
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Form.Item
            rules={[{ required: true }]}
            name='archetype'
            label={t('characters.identity.archetype_label')}>
            <ArchetypeSelector gender={gender} />
          </Form.Item>

          <InheritanceCard candidates={candidates} />

          <Spacing orientation='horizontal' wrap>
            <Button type='primary' htmlType='submit'>
              {t('new_character.create')}
            </Button>
            <Button htmlType='button' type='link' href='/characters'>
              {t('common.actions.cancel')}
            </Button>
          </Spacing>
        </Spacing>
      </Form>
    </Layout>
  )
}
