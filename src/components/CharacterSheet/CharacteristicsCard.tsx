'use client'

import { Card, Col, Divider, Form, InputNumber, Row, Typography } from 'antd'
import { copy } from '@/messages/fr'

type PoolKey = 'health' | 'courage' | 'stamina'

export function CharacteristicsCard() {
  const pools: readonly [PoolKey, string][] = [
    ['health', copy.playerCharacters.healthLabel],
    ['courage', copy.playerCharacters.courageLabel],
    ['stamina', copy.playerCharacters.staminaLabel],
  ]

  return (
    <>
      <Card title={copy.playerCharacters.characteristicsSection}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item
              name='honor'
              label={copy.playerCharacters.honorLabel}
              style={{ marginBottom: 0 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name='inspiration'
              label={copy.playerCharacters.inspirationLabel}
              style={{ marginBottom: 0 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name='money'
              label={copy.playerCharacters.moneyLabel}
              style={{ marginBottom: 0 }}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          {pools.map(([poolKey, label]) => (
            <Col xs={24} md={8} key={poolKey}>
              <Typography.Text style={{ display: 'block', marginBottom: 8 }}>
                {label}
              </Typography.Text>

              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name={[poolKey, 'current']}
                    label={copy.playerCharacters.currentLabel}
                    style={{ marginBottom: 0 }}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name={[poolKey, 'max']}
                    label={copy.playerCharacters.maxLabel}
                    style={{ marginBottom: 0 }}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
      </Card>
      <Typography.Text
        type='secondary'
        className='generator-rulebook-footnote character-sheet-rulebook-footnote'>
        {copy.playerCharacters.characteristicsFootnote}
      </Typography.Text>
    </>
  )
}
