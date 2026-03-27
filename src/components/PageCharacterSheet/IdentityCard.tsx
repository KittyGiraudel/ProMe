'use client'

import { Alert, Card, Col, Form, Input, Row, Select } from 'antd'
import { GENDERS } from '@/lib/types'
import type { Archetype } from '@/lib/character/types'
import { useTranslations } from 'next-intl'

export function IdentityCard({
  isArchetypeReadonly = false,
}: {
  isArchetypeReadonly?: boolean
}) {
  const t = useTranslations()
  const watchedArchetype = Form.useWatch('archetype') as Archetype | undefined
  const archetypePower = watchedArchetype
    ? t(`common.archetype_powers.${watchedArchetype}`)
    : null

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
            label={t('characters.identity.archetype_label')}
            style={{ marginBottom: archetypePower ? 8 : 0 }}>
            <Select
              disabled={isArchetypeReadonly}
              style={{ width: '100%' }}
              options={[
                {
                  value: 'warrior',
                  label: t('common.archetypes.warrior'),
                },
                {
                  value: 'pilgrim',
                  label: t('common.archetypes.pilgrim'),
                },
                {
                  value: 'bard',
                  label: t('common.archetypes.bard'),
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
      {archetypePower ? (
        <Row>
          <Col xs={24}>
            <Alert
              style={{ marginTop: 16 }}
              type='info'
              title={
                <>
                  <strong>
                    {t('characters.identity.archetype_power_label')} :
                  </strong>{' '}
                  {archetypePower}
                </>
              }
            />
          </Col>
        </Row>
      ) : null}
    </Card>
  )
}
