'use client'

import { Alert, Card, Col, Form, Input, Row, Select } from 'antd'
import { GENDERS } from '@/lib/types'
import type { Archetype } from '@/lib/character/types'
import { useLocalize } from '@/app/contexts/LocalizationContext'

export function IdentityCard({
  isArchetypeReadonly = false,
}: {
  isArchetypeReadonly?: boolean
}) {
  const localize = useLocalize()
  const watchedArchetype = Form.useWatch('archetype') as Archetype | undefined
  const archetypePower = watchedArchetype
    ? localize.string(`characters.archetypePowers.${watchedArchetype}`)
    : null

  return (
    <Card title={localize.string('characters.identitySection')}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Form.Item
            rules={[{ required: true }]}
            name='name'
            label={localize.string('characters.nameLabel')}
            style={{ marginBottom: 0 }}>
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            rules={[{ required: true }]}
            name='archetype'
            label={localize.string('characters.archetypeLabel')}
            style={{ marginBottom: archetypePower ? 8 : 0 }}>
            <Select
              disabled={isArchetypeReadonly}
              style={{ width: '100%' }}
              options={[
                {
                  value: 'warrior',
                  label: localize.string('archetypes.warrior'),
                },
                {
                  value: 'pilgrim',
                  label: localize.string('archetypes.pilgrim'),
                },
                {
                  value: 'bard',
                  label: localize.string('archetypes.bard'),
                },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            name='gender'
            label={localize.string('characters.genderLabel')}
            style={{ marginBottom: 0 }}>
            <Select
              allowClear
              style={{ width: '100%' }}
              options={GENDERS.map(gender => ({
                value: gender,
                label: localize.string(`genders.${gender}`),
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
                  <strong>
                    {localize.string('characters.archetypePowerLabel')} :
                  </strong>{' '}
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
