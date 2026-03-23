'use client'

import { Alert, Card, Col, Form, Input, Row, Select, Typography } from 'antd'
import { GENDERS } from '@/lib/types'
import type { Archetype } from '@/lib/character/types'
import { copy } from '@/messages/fr'

export function IdentityCard({
  isArchetypeReadonly = false,
}: {
  isArchetypeReadonly?: boolean
}) {
  const watchedArchetype = Form.useWatch('archetype') as Archetype | undefined

  const archetypePower = watchedArchetype
    ? copy.characters.archetypePowers[watchedArchetype]
    : null

  return (
    <Card title={copy.characters.identitySection}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Form.Item
            rules={[{ required: true }]}
            name='name'
            label={copy.characters.nameLabel}
            style={{ marginBottom: 0 }}>
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            rules={[{ required: true }]}
            name='archetype'
            label={copy.characters.archetypeLabel}
            style={{ marginBottom: archetypePower ? 8 : 0 }}>
            <Select
              disabled={isArchetypeReadonly}
              style={{ width: '100%' }}
              options={[
                {
                  value: 'warrior',
                  label: copy.characters.archetypes.warrior,
                },
                {
                  value: 'pilgrim',
                  label: copy.characters.archetypes.pilgrim,
                },
                {
                  value: 'bard',
                  label: copy.characters.archetypes.bard,
                },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            name='gender'
            label={copy.characters.genderLabel}
            style={{ marginBottom: 0 }}>
            <Select
              allowClear
              style={{ width: '100%' }}
              options={GENDERS.map(gender => ({
                value: gender,
                label: copy.genders[gender],
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
                  <strong>{copy.characters.archetypePowerLabel} :</strong>{' '}
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
