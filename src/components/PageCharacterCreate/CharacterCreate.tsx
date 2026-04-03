'use client'

import { Form } from 'antd'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { IdentityCard } from '@/components/IdentityCard/IdentityCard'
import { InheritanceCard } from '@/components/InheritanceCard/InheritanceCard'
import { Layout } from '@/components/Layout/Layout'
import { Spacing } from '@/components/Spacing/Spacing'
import { useCharacterCreate } from '@/hooks/useCharacterCreate'
import { useInheritanceCandidates } from '@/hooks/useInheritanceCandidates'
import type { Archetype } from '@/lib/character/types'
import type { Gender } from '@/lib/types'

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
          <IdentityCard isArchetypeReadonly={false} />
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
