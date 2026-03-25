'use client'

import { useTranslations } from 'next-intl'
import { Form, Space } from 'antd'
import type { Archetype } from '@/lib/character/types'
import type { Gender } from '@/lib/types'
import { Layout } from '@/components/Layout/Layout'
import { IdentityCard } from '@/components/CharacterSheet/IdentityCard'
import { Button } from '@/components/Button/Button'
import { useInheritanceCandidates } from './useInheritanceCandidates'
import { useCharacterCreate } from './useCharacterCreate'
import { InheritanceCard } from './InheritanceCard'

type CharacterCreateFormValues = {
  name: string
  archetype: Archetype
  gender?: Gender
  inheritFromCharacterId?: string
}

export function CharacterCreateClient() {
  const t = useTranslations()
  const [form] = Form.useForm<CharacterCreateFormValues>()
  const { handleCreate } = useCharacterCreate()
  const { candidates } = useInheritanceCandidates()

  return (
    <Layout
      title={t('new_character.title')}
      pageCoverBiome='floodedPlains'
      breadcrumbs={[
        { label: t('nav.home_link'), href: '/' },
        { label: t('new_character.title'), href: '/characters' },
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
              {t('common.cancel')}
            </Button>
          </Space>
        </Space>
      </Form>
    </Layout>
  )
}
