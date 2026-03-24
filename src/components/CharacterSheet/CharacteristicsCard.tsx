'use client'

import { QuestionCircleOutlined, RedoOutlined } from '@ant-design/icons'
import {
  App,
  Card,
  Col,
  Divider,
  Form,
  InputNumber,
  Popover,
  Row,
  Tooltip,
  Typography,
} from 'antd'
import { copy } from '@/messages/fr'
import { Button } from '@/components/Button/Button'

type PoolKey = 'health' | 'courage' | 'stamina'
type ResourceKey = 'honor' | 'inspiration' | 'money'

export function CharacteristicsCard() {
  const { notification } = App.useApp()
  const form = Form.useFormInstance()
  const courageCurrent = Form.useWatch(['courage', 'current'], form) as
    | number
    | undefined

  const resources: readonly [ResourceKey, string, string][] = [
    ['honor', copy.characters.honorLabel, copy.characters.honorTooltip],
    [
      'inspiration',
      copy.characters.inspirationLabel,
      copy.characters.inspirationTooltip,
    ],
    ['money', copy.characters.moneyLabel, copy.characters.moneyTooltip],
  ]

  const pools: readonly [PoolKey, string, string][] = [
    ['health', copy.characters.healthLabel, copy.characters.healthTooltip],
    ['courage', copy.characters.courageLabel, copy.characters.courageTooltip],
    ['stamina', copy.characters.staminaLabel, copy.characters.staminaTooltip],
  ]

  function renderLabelWithHelp(label: string, tooltip: string) {
    return (
      <Typography.Text
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
        <span>{label}</span>
        <Popover
          title={label}
          content={
            <>
              {tooltip.split('\n').map((paragraph, index) => (
                <Typography.Text
                  strong={index === 0}
                  key={paragraph}
                  style={{ display: 'block', marginBottom: 8 }}>
                  {paragraph}
                </Typography.Text>
              ))}
              <Typography.Text
                style={{
                  display: 'block',
                  marginBottom: 8,
                  color: '#8c8c8c',
                }}
                italic>
                {copy.characters.characteristicsFootnote}
              </Typography.Text>
            </>
          }
          trigger='click'
          placement='top'
          styles={{ root: { maxWidth: 360 } }}>
          <Button
            type='text'
            size='small'
            htmlType='button'
            icon={<QuestionCircleOutlined />}
            aria-label={`Informations sur ${label}`}
            style={{
              padding: 0,
              width: 18,
              height: 18,
              color: '#8c8c8c',
            }}
          />
        </Popover>
      </Typography.Text>
    )
  }

  const handleCourageRoll = () => {
    const target = Math.max(0, courageCurrent ?? 0)
    const roll = Math.floor(Math.random() * 6) + 1
    const success = roll <= target

    notification[success ? 'success' : 'error']({
      title: success
        ? copy.characters.courageRollSuccessTitle
        : copy.characters.courageRollFailureTitle,
      description: copy.characters.courageRollResult(roll, target),
      placement: 'bottomRight',
      duration: 15,
    })
  }

  return (
    <>
      <Card
        title={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <span>{copy.characters.characteristicsSection}</span>
            <Tooltip title={copy.characters.characteristicsFootnote}>
              <Button
                type='text'
                size='small'
                htmlType='button'
                icon={<QuestionCircleOutlined />}
                aria-label='Informations du livre de règles'
              />
            </Tooltip>
          </div>
        }>
        <Row gutter={[16, 16]}>
          {resources.map(([resourceKey, label, tooltip]) => (
            <Col xs={24} md={8} key={resourceKey}>
              <Form.Item
                name={resourceKey}
                label={renderLabelWithHelp(label, tooltip)}
                style={{ marginBottom: 0 }}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          ))}
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          {pools.map(([poolKey, label, tooltip]) => (
            <Col xs={24} md={8} key={poolKey}>
              <div
                style={{
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}>
                {renderLabelWithHelp(label, tooltip)}
                {poolKey === 'courage' ? (
                  <Tooltip title={copy.characters.courageRollTooltip}>
                    <Button
                      type='text'
                      size='small'
                      htmlType='button'
                      icon={<RedoOutlined />}
                      aria-label={copy.characters.courageRollAria}
                      onClick={handleCourageRoll}
                    />
                  </Tooltip>
                ) : null}
              </div>

              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name={[poolKey, 'current']}
                    label={copy.characters.currentLabel}
                    style={{ marginBottom: 0 }}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name={[poolKey, 'max']}
                    label={copy.characters.maxLabel}
                    style={{ marginBottom: 0 }}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
      </Card>
    </>
  )
}
