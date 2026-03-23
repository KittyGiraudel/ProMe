'use client'

import { Card, Col, Form, Input, Row, Select } from 'antd'
import { GENDERS } from '@/lib/types'
import { copy } from '@/messages/fr'

export function IdentityCard() {
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
            style={{ marginBottom: 0 }}>
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
            label={copy.playerCharacters.genderPlaceholder}
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
    </Card>
  )
}
