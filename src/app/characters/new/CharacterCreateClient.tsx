'use client'

import { Button, Form, Space } from 'antd'
import type { Archetype } from '@/lib/character/types'
import type { Gender } from '@/lib/types'
import { Layout } from '@/components/Layout/Layout'
import { IdentityCard } from '@/components/CharacterSheet/IdentityCard'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { copy } from '@/messages/fr'
import { useCharacterCreate } from './useCharacterCreate'

type CharacterCreateFormValues = {
  name: string
  archetype: Archetype
  gender?: Gender
}

export function CharacterCreateClient() {
  const [form] = Form.useForm<CharacterCreateFormValues>()
  const { handleCreate } = useCharacterCreate()

  return (
    <Layout
      title={copy.characters.createPageTitle}
      description={copy.characters.createPageDescription}
      breadcrumbs={[
        { label: copy.nav.homeLink, href: '/' },
        { label: copy.characters.pageTitle, href: '/characters' },
      ]}>
      <Form<CharacterCreateFormValues>
        form={form}
        layout='vertical'
        colon={false}
        initialValues={{ name: '', archetype: 'warrior', gender: undefined }}
        onFinish={handleCreate}>
        <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
          <IdentityCard isArchetypeReadonly={false} />
          <Space wrap>
            <Button type='primary' htmlType='submit'>
              {copy.characters.create}
            </Button>
            <Button htmlType='button' type='link' href='/characters'>
              {copy.characters.cancel}
            </Button>
          </Space>
        </Space>
      </Form>
    </Layout>
  )
}
