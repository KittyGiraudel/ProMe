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
    ? t(`characters.archetype_powers.${watchedArchetype}`)
    : null

  return (
    <Card title={t('characters.identity_section')}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Form.Item
            rules={[{ required: true }]}
            name='name'
            label={t('characters.name_label')}
            style={{ marginBottom: 0 }}>
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            rules={[{ required: true }]}
            name='archetype'
            label={t('characters.archetype_label')}
            style={{ marginBottom: archetypePower ? 8 : 0 }}>
            <Select
              disabled={isArchetypeReadonly}
              style={{ width: '100%' }}
              options={[
                {
                  value: 'warrior',
                  label: t('archetypes.warrior'),
                },
                {
                  value: 'pilgrim',
                  label: t('archetypes.pilgrim'),
                },
                {
                  value: 'bard',
                  label: t('archetypes.bard'),
                },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            name='gender'
            label={t('characters.gender_label')}
            style={{ marginBottom: 0 }}>
            <Select
              allowClear
              style={{ width: '100%' }}
              options={GENDERS.map(gender => ({
                value: gender,
                label: t(`genders.${gender}`),
              }))}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          {archetypePower ? (
            <Alert
              style={{ marginTop: 16 }}
              type='info'
              title={
                <>
                  <strong>{t('characters.archetype_power_label')} :</strong>{' '}
                  {archetypePower}
                </>
              }
            />
          ) : null}
        </Col>
      </Row>
    </Card>
  )
}
