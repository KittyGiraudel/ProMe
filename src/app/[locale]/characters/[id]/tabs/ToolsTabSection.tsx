'use client'

import { Col, Row } from 'antd'
import { CardDraw } from '@/components/CardDraw/CardDraw'
import { DiceRoll } from '@/components/DiceRoll/DiceRoll'

export function ToolsTabSection() {
  return (
    <Row gutter={16}>
      <Col span={12}>
        <DiceRoll />
      </Col>
      <Col span={12}>
        <CardDraw />
      </Col>
    </Row>
  )
}
