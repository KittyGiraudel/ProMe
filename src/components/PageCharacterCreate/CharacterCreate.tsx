'use client'

import { Form, Space } from 'antd'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { Layout } from '@/components/Layout/Layout'
import { IdentityCard } from '@/components/PageCharacterSheet/IdentityCard'
import type { Archetype } from '@/lib/character/types'
import type { Gender } from '@/lib/types'
import { InheritanceCard } from './InheritanceCard'
import { useCharacterCreate } from './useCharacterCreate'
import { useInheritanceCandidates } from './useInheritanceCandidates'

type CharacterCreateFormValues = {
  name: string
  archetype: Archetype
  gender?: Gender
  inheritFromCharacterId?: string
}

export function CharacterCreate() {
  const t = useTranslations()
  const [form] = Form.useForm<CharacterCreateFormValues>()
  const { handleCreate } = useCharacterCreate()
  const { candidates } = useInheritanceCandidates()

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
        <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
          <IdentityCard isArchetypeReadonly={false} />
          <InheritanceCard candidates={candidates} />
          <Space wrap>
            <Button type='primary' htmlType='submit'>
              {t('new_character.create')}
            </Button>
            <Button htmlType='button' type='link' href='/characters'>
              {t('common.actions.cancel')}
            </Button>
          </Space>
        </Space>
      </Form>
    </Layout>
  )
}
