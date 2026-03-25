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
import { Button } from '@/components/Button/Button'
import { useLocalize } from '@/app/contexts/LocalizationContext'

type PoolKey = 'health' | 'courage' | 'stamina'
type ResourceKey = 'honor' | 'inspiration' | 'money'

export function CharacteristicsCard() {
  const localize = useLocalize()
  const { notification } = App.useApp()
  const form = Form.useFormInstance()
  const courageCurrent = Form.useWatch(['courage', 'current'], form) as
    | number
    | undefined

  const resources: readonly [ResourceKey, string, string][] = [
    [
      'honor',
      localize.string('characters.honorLabel'),
      localize.string('characters.honorTooltip'),
    ],
    [
      'inspiration',
      localize.string('characters.inspirationLabel'),
      localize.string('characters.inspirationTooltip'),
    ],
    [
      'money',
      localize.string('characters.moneyLabel'),
      localize.string('characters.moneyTooltip'),
    ],
  ]

  const pools: readonly [PoolKey, string, string][] = [
    [
      'health',
      localize.string('characters.healthLabel'),
      localize.string('characters.healthTooltip'),
    ],
    [
      'courage',
      localize.string('characters.courageLabel'),
      localize.string('characters.courageTooltip'),
    ],
    [
      'stamina',
      localize.string('characters.staminaLabel'),
      localize.string('characters.staminaTooltip'),
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
                {localize.string('characters.characteristicsFootnote')}
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
            aria-label={localize.string('rulebook.information')}
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
        ? localize.string('characters.courageRollSuccessTitle')
        : localize.string('characters.courageRollFailureTitle'),
      description: localize.string(
        roll <= target
          ? 'characters.courageRollResultSuccess'
          : 'characters.courageRollResultFailure',
        { roll, target }
      ),
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
            <span>{localize.string('characters.characteristicsSection')}</span>
            <Tooltip
              title={localize.string('characters.characteristicsFootnote')}>
              <Button
                type='text'
                size='small'
                htmlType='button'
                icon={<QuestionCircleOutlined />}
                aria-label={localize.string('rulebook.information')}
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
                  <Tooltip
                    title={localize.string('characters.courageRollTooltip')}>
                    <Button
                      type='text'
                      size='small'
                      htmlType='button'
                      icon={<RedoOutlined />}
                      aria-label={localize.string('characters.courageRollAria')}
                      onClick={handleCourageRoll}
                    />
                  </Tooltip>
                ) : null}
              </div>

              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name={[poolKey, 'current']}
                    label={localize.string('characters.currentLabel')}
                    style={{ marginBottom: 0 }}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name={[poolKey, 'max']}
                    label={localize.string('characters.maxLabel')}
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
