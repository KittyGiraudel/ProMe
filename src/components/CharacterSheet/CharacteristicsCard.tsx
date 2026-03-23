'use client'

import { QuestionCircleOutlined, RedoOutlined } from '@ant-design/icons'
import {
  App,
  Button,
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

type PoolKey = 'health' | 'courage' | 'stamina'
type ResourceKey = 'honor' | 'inspiration' | 'money'

export function CharacteristicsCard() {
  const { notification } = App.useApp()
  const form = Form.useFormInstance()
  const courageCurrent = Form.useWatch(['courage', 'current'], form) as
    | number
    | undefined

  const resources: readonly [ResourceKey, string, string][] = [
    [
      'honor',
      copy.playerCharacters.honorLabel,
      copy.playerCharacters.honorTooltip,
    ],
    [
      'inspiration',
      copy.playerCharacters.inspirationLabel,
      copy.playerCharacters.inspirationTooltip,
    ],
    [
      'money',
      copy.playerCharacters.moneyLabel,
      copy.playerCharacters.moneyTooltip,
    ],
  ]

  const pools: readonly [PoolKey, string, string][] = [
    [
      'health',
      copy.playerCharacters.healthLabel,
      copy.playerCharacters.healthTooltip,
    ],
    [
      'courage',
      copy.playerCharacters.courageLabel,
      copy.playerCharacters.courageTooltip,
    ],
    [
      'stamina',
      copy.playerCharacters.staminaLabel,
      copy.playerCharacters.staminaTooltip,
    ],
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
                {copy.playerCharacters.characteristicsFootnote}
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
        ? copy.playerCharacters.courageRollSuccessTitle
        : copy.playerCharacters.courageRollFailureTitle,
      description: copy.playerCharacters.courageRollResult(roll, target),
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
            <span>{copy.playerCharacters.characteristicsSection}</span>
            <Tooltip title={copy.playerCharacters.characteristicsFootnote}>
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
                  <Tooltip title={copy.playerCharacters.courageRollTooltip}>
                    <Button
                      type='text'
                      size='small'
                      htmlType='button'
                      icon={<RedoOutlined />}
                      aria-label={copy.playerCharacters.courageRollAria}
                      onClick={handleCourageRoll}
                    />
                  </Tooltip>
                ) : null}
              </div>

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
    </>
  )
}
