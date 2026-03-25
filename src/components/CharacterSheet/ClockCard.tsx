'use client'

import { QuestionCircleOutlined } from '@ant-design/icons'
import { App, Card, Form, Input, Popover, Space, Tag, Typography } from 'antd'
import {
  computeClockSegmentsPerHalfFromStamina,
  computeClockTotalSegmentsFromStamina,
} from '@/lib/character/model'
import { ClockDisplay } from '@/components/ClockDisplay/ClockDisplay'
import type { StatPool } from '@/lib/character/types'
import { Button } from '@/components/Button/Button'
import { useLocalize } from '@/app/contexts/LocalizationContext'

export function ClockCard() {
  const localize = useLocalize()
  const { notification } = App.useApp()
  const form = Form.useFormInstance()
  const watchOpts = { form, preserve: true } as const
  const stamina = Form.useWatch('stamina', watchOpts) as StatPool | undefined
  const clock = Form.useWatch('clock', watchOpts) as number | undefined

  const staminaCurrent = stamina?.current ?? 0
  const segmentsPerHalf = computeClockSegmentsPerHalfFromStamina(staminaCurrent)
  const totalSegments = computeClockTotalSegmentsFromStamina(staminaCurrent)

  const position = Math.min(
    Math.max(0, Math.trunc(clock ?? 0)),
    totalSegments - 1
  )
  const isDay = position < segmentsPerHalf
  const phaseLabel = isDay
    ? localize.string('characters.clockDay')
    : localize.string('characters.clockNight')
  const clockLabel = localize.string('characters.clockSlice', {
    position: position + 1,
    total: totalSegments,
  })

  const setPosition = (nextPosition: number) => {
    const wrapped =
      ((nextPosition % totalSegments) + totalSegments) % totalSegments
    const nextIsDay = wrapped < segmentsPerHalf
    form.setFieldValue('clock', wrapped)
    if (nextIsDay !== isDay) {
      notification.warning({
        title: localize.string(
          nextIsDay
            ? 'characters.clockPhaseShiftDay'
            : 'characters.clockPhaseShiftNight'
        ),
        description:
          localize.string('characters.clockPhaseShiftDescription') +
          '\n' +
          localize.string('characters.clockSlice', {
            position: wrapped + 1,
            total: totalSegments,
          }),
        placement: 'bottomRight',
        duration: 4,
      })
      return
    }

    notification.success({
      title: localize.string('characters.clockSection'),
      description: localize.string('characters.clockSlice', {
        position: wrapped + 1,
        total: totalSegments,
      }),
      placement: 'bottomRight',
      duration: 2,
    })
  }

  return (
    <Card
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <span>{localize.string('characters.clockSection')}</span>
          <Popover
            title={localize.string('characters.clockSection')}
            content={
              <>
                {localize
                  .string('characters.clockTooltip')
                  .split('\n')
                  .map((paragraph, index) => (
                    <Typography.Text
                      key={`${paragraph}-${index}`}
                      strong={index === 0}
                      style={{ display: 'block', marginBottom: 8 }}>
                      {paragraph}
                    </Typography.Text>
                  ))}
                <Typography.Text
                  italic
                  style={{
                    display: 'block',
                    marginBottom: 8,
                    color: '#8c8c8c',
                  }}>
                  {localize.string('characters.clockFootnote')}
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
            />
          </Popover>
        </div>
      }>
      <Space orientation='vertical' size='small' style={{ width: '100%' }}>
        <ClockDisplay
          label={clockLabel}
          totalSegments={totalSegments}
          segmentsPerHalf={segmentsPerHalf}
          position={position}
        />
        <Form.Item name='clock' hidden>
          <Input />
        </Form.Item>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button htmlType='button' onClick={() => setPosition(position - 1)}>
            {localize.string('characters.clockBack')}
          </Button>
          <Space wrap>
            <Tag color={isDay ? 'gold' : 'blue'}>{phaseLabel}</Tag>
            <Typography.Text>{clockLabel}</Typography.Text>
          </Space>
          <Button
            type='primary'
            htmlType='button'
            onClick={() => setPosition(position + 1)}>
            {localize.string('characters.clockAdvance')}
          </Button>
        </Space>
      </Space>
    </Card>
  )
}
