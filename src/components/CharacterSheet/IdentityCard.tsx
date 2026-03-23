'use client'

import { Alert, Card, Col, Form, Input, Row, Select, Typography } from 'antd'
import { GENDERS } from '@/lib/types'
import type { PlayerArchetype } from '@/lib/playerCharacter/types'
import { copy } from '@/messages/fr'

export function IdentityCard() {
  const watchedArchetype = Form.useWatch('archetype') as
    | PlayerArchetype
    | undefined

  const archetypePower = watchedArchetype
    ? copy.playerCharacters.archetypePowers[watchedArchetype]
    : null

  return (
    <Card title={copy.playerCharacters.identitySection}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Form.Item
            rules={[{ required: true }]}
            name='name'
            label={copy.playerCharacters.nameLabel}
            style={{ marginBottom: 0 }}>
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            rules={[{ required: true }]}
            name='archetype'
            label={copy.playerCharacters.archetypeLabel}
            style={{ marginBottom: archetypePower ? 8 : 0 }}>
            <Select
              style={{ width: '100%' }}
              options={[
                {
                  value: 'warrior',
                  label: copy.playerCharacters.archetypes.warrior,
                },
                {
                  value: 'pilgrim',
                  label: copy.playerCharacters.archetypes.pilgrim,
                },
                {
                  value: 'bard',
                  label: copy.playerCharacters.archetypes.bard,
                },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            name='gender'
            label={copy.playerCharacters.genderLabel}
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
                  <strong>{copy.playerCharacters.archetypePowerLabel} :</strong>{' '}
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
