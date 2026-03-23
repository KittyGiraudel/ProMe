'use client'

import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  App,
  Button,
  Card,
  Form,
  Input,
  Popover,
  Space,
  Tag,
  Typography,
} from 'antd'
import {
  computeClockSegmentsPerHalfFromStamina,
  computeClockTotalSegmentsFromStamina,
} from '@/lib/playerCharacter/model'
import { ClockDisplay } from '@/components/ClockDisplay/ClockDisplay'
import type { CharacterClock, StatPool } from '@/lib/playerCharacter/types'
import { copy } from '@/messages/fr'

export function ClockCard() {
  const { notification } = App.useApp()
  const form = Form.useFormInstance()
  const stamina = Form.useWatch('stamina', form) as StatPool | undefined
  const clock = Form.useWatch('clock', form) as CharacterClock | undefined

  const staminaCurrent = stamina?.current ?? 0
  const segmentsPerHalf = computeClockSegmentsPerHalfFromStamina(staminaCurrent)
  const totalSegments = computeClockTotalSegmentsFromStamina(staminaCurrent)

  const position = Math.min(
    Math.max(0, Math.trunc(clock?.position ?? 0)),
    totalSegments - 1
  )
  const isDay = position < segmentsPerHalf
  const phaseLabel = isDay
    ? copy.playerCharacters.clockDay
    : copy.playerCharacters.clockNight

  const setPosition = (nextPosition: number) => {
    const wrapped =
      ((nextPosition % totalSegments) + totalSegments) % totalSegments
    const nextIsDay = wrapped < segmentsPerHalf
    form.setFieldValue(['clock', 'position'], wrapped)
    if (nextIsDay !== isDay) {
      notification.warning({
        title: copy.playerCharacters.clockPhaseShiftTitle(
          nextIsDay
            ? copy.playerCharacters.clockDay
            : copy.playerCharacters.clockNight
        ),
        description: copy.playerCharacters.clockPhaseShiftDescription(
          copy.playerCharacters.clockSlice(wrapped + 1, totalSegments)
        ),
        placement: 'bottomRight',
        duration: 4,
      })
      return
    }

    notification.success({
      title: copy.playerCharacters.clockSection,
      description: copy.playerCharacters.clockSlice(wrapped + 1, totalSegments),
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
          <span>{copy.playerCharacters.clockSection}</span>
          <Popover
            title={copy.playerCharacters.clockSection}
            content={
              <>
                {copy.playerCharacters.clockTooltip
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
                  {copy.playerCharacters.clockFootnote}
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
        <Form.Item name={['clock', 'position']} hidden>
          <Input />
        </Form.Item>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button htmlType='button' onClick={() => setPosition(position - 1)}>
            {copy.playerCharacters.clockBack}
          </Button>
          <Space wrap>
            <Tag color={isDay ? 'gold' : 'blue'}>{phaseLabel}</Tag>
            <Typography.Text>
              {copy.playerCharacters.clockSlice(position + 1, totalSegments)}
            </Typography.Text>
          </Space>
          <Button
            type='primary'
            htmlType='button'
            onClick={() => setPosition(position + 1)}>
            {copy.playerCharacters.clockAdvance}
          </Button>
        </Space>
      </Space>
    </Card>
  )
}
