'use client'

import { Alert, Card, Col, Form, Input, Row, Select } from 'antd'
import { Gender, GENDERS } from '@/lib/types'
import type { Archetype } from '@/lib/character/types'
import { useTranslations } from 'next-intl'

export function IdentityCard({
  isArchetypeReadonly = false,
}: {
  isArchetypeReadonly?: boolean
}) {
  const t = useTranslations()
  const watchedArchetype = Form.useWatch('archetype') as Archetype | undefined
  const gender = Form.useWatch('gender') ?? ('indeterminate' as Gender)

  return (
    <Card title={t('characters.identity.identity_section')}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Form.Item
            rules={[{ required: true }]}
            name='name'
            label={t('characters.identity.name_label')}
            style={{ marginBottom: 0 }}>
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            rules={[{ required: true }]}
            name='archetype'
            label={t('characters.identity.archetype_label')}>
            <Select
              disabled={isArchetypeReadonly}
              style={{ width: '100%' }}
              options={[
                {
                  value: 'warrior',
                  label: t('common.archetypes.warrior', { gender }),
                },
                {
                  value: 'pilgrim',
                  label: t('common.archetypes.pilgrim', { gender }),
                },
                {
                  value: 'bard',
                  label: t('common.archetypes.bard', { gender }),
                },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            name='gender'
            label={t('characters.identity.gender_label')}
            style={{ marginBottom: 0 }}>
            <Select
              allowClear
              style={{ width: '100%' }}
              options={GENDERS.map(gender => ({
                value: gender,
                label: t(`common.genders.${gender}`),
              }))}
            />
          </Form.Item>
        </Col>
      </Row>

      {watchedArchetype ? (
        <Alert
          type='info'
          title={t(`common.archetype_powers.${watchedArchetype}_title`)}
          description={t(
            `common.archetype_powers.${watchedArchetype}_description`
          )}
        />
      ) : null}
    </Card>
  )
}
