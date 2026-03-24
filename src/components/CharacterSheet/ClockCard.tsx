'use client'

import { QuestionCircleOutlined } from '@ant-design/icons'
import { App, Card, Form, Input, Popover, Space, Tag, Typography } from 'antd'
import {
  computeClockSegmentsPerHalfFromStamina,
  computeClockTotalSegmentsFromStamina,
} from '@/lib/character/model'
import { ClockDisplay } from '@/components/ClockDisplay/ClockDisplay'
import type { StatPool } from '@/lib/character/types'
import { copy } from '@/messages/fr'
import { Button } from '@/components/Button/Button'

export function ClockCard() {
  const { notification } = App.useApp()
  const form = Form.useFormInstance()
  const stamina = Form.useWatch('stamina', form) as StatPool | undefined
  const clock = Form.useWatch('clock', form) as number | undefined

  const staminaCurrent = stamina?.current ?? 0
  const segmentsPerHalf = computeClockSegmentsPerHalfFromStamina(staminaCurrent)
  const totalSegments = computeClockTotalSegmentsFromStamina(staminaCurrent)

  const position = Math.min(
    Math.max(0, Math.trunc(clock ?? 0)),
    totalSegments - 1
  )
  const isDay = position < segmentsPerHalf
  const phaseLabel = isDay
    ? copy.characters.clockDay
    : copy.characters.clockNight

  const setPosition = (nextPosition: number) => {
    const wrapped =
      ((nextPosition % totalSegments) + totalSegments) % totalSegments
    const nextIsDay = wrapped < segmentsPerHalf
    form.setFieldValue('clock', wrapped)
    if (nextIsDay !== isDay) {
      notification.warning({
        title: copy.characters.clockPhaseShiftTitle(
          nextIsDay ? copy.characters.clockDay : copy.characters.clockNight
        ),
        description: copy.characters.clockPhaseShiftDescription(
          copy.characters.clockSlice(wrapped + 1, totalSegments)
        ),
        placement: 'bottomRight',
        duration: 4,
      })
      return
    }

    notification.success({
      title: copy.characters.clockSection,
      description: copy.characters.clockSlice(wrapped + 1, totalSegments),
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
          <span>{copy.characters.clockSection}</span>
          <Popover
            title={copy.characters.clockSection}
            content={
              <>
                {copy.characters.clockTooltip
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
                  {copy.characters.clockFootnote}
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
              aria-label='Informations du livre de règles'
            />
          </Popover>
        </div>
      }>
      <Space orientation='vertical' size='small' style={{ width: '100%' }}>
        <ClockDisplay
          totalSegments={totalSegments}
          segmentsPerHalf={segmentsPerHalf}
          position={position}
        />
        <Form.Item name='clock' hidden>
          <Input />
        </Form.Item>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button htmlType='button' onClick={() => setPosition(position - 1)}>
            {copy.characters.clockBack}
          </Button>
          <Space wrap>
            <Tag color={isDay ? 'gold' : 'blue'}>{phaseLabel}</Tag>
            <Typography.Text>
              {copy.characters.clockSlice(position + 1, totalSegments)}
            </Typography.Text>
          </Space>
          <Button
            type='primary'
            htmlType='button'
            onClick={() => setPosition(position + 1)}>
            {copy.characters.clockAdvance}
          </Button>
        </Space>
      </Space>
    </Card>
  )
}
