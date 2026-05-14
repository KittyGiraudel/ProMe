'use client'

import { App, Button, Card, Col, Form, Input, Row, Select } from 'antd'
import { useTranslations } from 'next-intl'
import { AppLinkButton } from '@/components/AppLinkButton/AppLinkButton'
import { ArchetypeSelector } from '@/components/ArchetypeSelector/ArchetypeSelector'
import { InheritanceCard } from '@/components/InheritanceCard/InheritanceCard'
import { Layout } from '@/components/Layout/Layout'
import { Spacing } from '@/components/Spacing/Spacing'
import { GENDERS } from '@/constants/misc'
import { useCharacterCreate } from '@/hooks/useMutation'
import { toRouterHref, useRouter } from '@/i18n/navigation'
import type { Archetype } from '@/lib/character/types'
import type { Gender } from '@/lib/types'

import './CharacterCreate.css'

type CharacterCreateFormValues = {
  name: string
  archetype: Archetype
  gender?: Gender
  inheritFromCharacterId?: string
}

const DEFAULT_VALUES: CharacterCreateFormValues = {
  name: '',
  archetype: 'swordbearer',
  gender: undefined,
  inheritFromCharacterId: undefined,
}

export function CharacterCreate() {
  const t = useTranslations()
  const router = useRouter()
  const { message } = App.useApp()
  const [form] = Form.useForm<CharacterCreateFormValues>()
  const [create] = useCharacterCreate({
    onCompleted: character => {
      message.success(t('new_character.create_success'))
      router.push(
        toRouterHref({ route: 'character', params: { id: character.id } })
      )
    },
    onError: () => message.error(t('errors.create')),
  })
  const gender = Form.useWatch('gender', form)

  return (
    <Layout
      title={t('new_character.title')}
      bannerBiome='sunkenSavannah'
      breadcrumbs={[
        { title: t('nav.home'), to: { route: 'home' } },
        { title: t('nav.characters'), to: { route: 'characters' } },
        { title: t('nav.new_character'), to: { route: 'newCharacter' } },
      ]}>
      <Form<CharacterCreateFormValues>
        form={form}
        layout='vertical'
        colon={false}
        initialValues={DEFAULT_VALUES}
        onFinish={values => {
          void create(values)
        }}>
        <Spacing size='large'>
          <Card
            title={<h2>{t('characters.identity.identity_section')}</h2>}
            id='identity'>
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
            label={t('characters.identity.archetype_label')}
            noStyle>
            <ArchetypeSelector gender={gender} />
          </Form.Item>

          <InheritanceCard />

          <Spacing orientation='horizontal' wrap>
            <Button type='primary' htmlType='submit'>
              {t('new_character.create')}
            </Button>
            <AppLinkButton type='link' to={{ route: 'characters' }}>
              {t('common.actions.cancel')}
            </AppLinkButton>
          </Spacing>
        </Spacing>
      </Form>
    </Layout>
  )
}
