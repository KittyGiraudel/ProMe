'use client'

import { Form, Space } from 'antd'
import type { Archetype } from '@/lib/character/types'
import type { Gender } from '@/lib/types'
import { Layout } from '@/components/Layout/Layout'
import { IdentityCard } from '@/components/CharacterSheet/IdentityCard'
import { useCharacterCreate } from './useCharacterCreate'
import { Button } from '@/components/Button/Button'
import { useInheritanceCandidates } from './useInheritanceCandidates'
import { InheritanceCard } from './InheritanceCard'
import { useLocalize } from '@/app/contexts/LocalizationContext'

type CharacterCreateFormValues = {
  name: string
  archetype: Archetype
  gender?: Gender
  inheritFromCharacterId?: string
}

export function CharacterCreateClient() {
  const localize = useLocalize()
  const [form] = Form.useForm<CharacterCreateFormValues>()
  const { handleCreate } = useCharacterCreate()
  const { candidates } = useInheritanceCandidates()

  return (
    <Layout
      title={localize.string('characters.createPageTitle')}
      pageCoverBiome='floodedPlains'
      breadcrumbs={[
        { label: localize.string('nav.homeLink'), href: '/' },
        { label: localize.string('characters.pageTitle'), href: '/characters' },
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
              {localize.string('characters.create')}
            </Button>
            <Button htmlType='button' type='link' href='/characters'>
              {localize.string('characters.cancel')}
            </Button>
          </Space>
        </Space>
      </Form>
    </Layout>
  )
}
