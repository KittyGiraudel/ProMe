'use client'

import RedoOutlined from '@ant-design/icons/lib/icons/RedoOutlined'
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
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { HelpButton } from '../HelpButton/HelpButton'

type PoolKey = 'health' | 'courage' | 'stamina'
type ResourceKey = 'honor' | 'inspiration' | 'money'

export function CharacteristicsCard() {
  const t = useTranslations()
  const { notification } = App.useApp()
  const form = Form.useFormInstance()
  const courageCurrent = Form.useWatch(['courage', 'current'], form) as
    | number
    | undefined

  const resources: readonly [ResourceKey, string, string][] = [
    [
      'honor',
      t('characters.identity.honor_label'),
      t('characters.identity.honor_tooltip'),
    ],
    [
      'inspiration',
      t('characters.identity.inspiration_label'),
      t('characters.identity.inspiration_tooltip'),
    ],
    [
      'money',
      t('characters.identity.money_label'),
      t('characters.identity.money_tooltip'),
    ],
  ]

  const pools: readonly [PoolKey, string, string][] = [
    [
      'health',
      t('characters.identity.health_label'),
      t('characters.identity.health_tooltip'),
    ],
    [
      'courage',
      t('characters.identity.courage_label'),
      t('characters.identity.courage_tooltip'),
    ],
    [
      'stamina',
      t('characters.identity.stamina_label'),
      t('characters.identity.stamina_tooltip'),
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
                {t('rulebook.characteristics_footnote')}
              </Typography.Text>
            </>
          }
          trigger='click'
          placement='top'
          styles={{ root: { maxWidth: 360 } }}>
          <HelpButton label={t('rulebook.information')} />
        </Popover>
      </Typography.Text>
    )
  }

  const handleCourageRoll = () => {
    const target = Math.max(0, courageCurrent ?? 0)
    const roll = Math.floor(Math.random() * 6) + 1
    const success = roll <= target
    const status = success ? 'success' : 'failure'

    notification[success ? 'success' : 'error']({
      title: t('characters.identity.courage_roll_title'),
      description: t('characters.identity.courage_roll_result', {
        roll,
        target,
        status,
      }),
      placement: 'bottomRight',
      duration: 15,
    })
  }

  return (
    <>
      <Card
        title={t('characters.identity.characteristics_section')}
        extra={
          <Tooltip title={t('rulebook.characteristics_footnote')}>
            <HelpButton label={t('rulebook.information')} />
          </Tooltip>
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
                    title={t('characters.identity.courage_roll_tooltip')}>
                    <Button
                      type='text'
                      size='small'
                      htmlType='button'
                      icon={<RedoOutlined />}
                      aria-label={t('characters.identity.courage_roll_aria')}
                      onClick={handleCourageRoll}
                    />
                  </Tooltip>
                ) : null}
              </div>

              <Row gutter={[8, 8]}>
                <Col xs={12}>
                  <Form.Item
                    name={[poolKey, 'current']}
                    label={t('common.current_label')}
                    style={{ marginBottom: 0 }}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                <Col xs={12}>
                  <Form.Item
                    name={[poolKey, 'max']}
                    label={t('common.max_label')}
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
