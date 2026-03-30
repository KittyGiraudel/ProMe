'use client'

import { Card, Form, Input, Popover, Space, Tag, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { Button } from '@/components/Button/Button'
import { ClockDisplay } from '@/components/ClockDisplay/ClockDisplay'
import {
  clampClockSliceIndex,
  countHalfClockSegments,
  isClockDayPhase,
} from '@/lib/character/clock'
import { useSetClockToRawTargetWithToast } from '@/lib/character/clockPositionNotifications'
import type { StatPool } from '@/lib/character/types'
import { HelpButton } from '../HelpButton/HelpButton'

export function ClockCard() {
  const t = useTranslations()
  const form = Form.useFormInstance()
  const watchOpts = { form, preserve: true } as const
  const stamina = Form.useWatch('stamina', watchOpts) as StatPool | undefined
  const clock = Form.useWatch('clock', watchOpts) as number | undefined
  const updateClock = useCallback(
    (wrapped: number) => form.setFieldValue('clock', wrapped),
    [form]
  )
  const setClockToRawTargetWithToast = useSetClockToRawTargetWithToast({
    updateClock,
  })
  const staminaCurrent = stamina?.current ?? 0
  const segmentsPerHalf = countHalfClockSegments(staminaCurrent)
  const totalSegments = segmentsPerHalf * 2
  const position = clampClockSliceIndex(staminaCurrent, clock)
  const isDay = isClockDayPhase(position, segmentsPerHalf)
  const phaseLabel = isDay
    ? t('characters.map.clock_day')
    : t('characters.map.clock_night')
  const clockLabel = t('characters.map.clock_slice', {
    position: position + 1,
    total: totalSegments,
  })

  const setPosition = (nextPosition: number) => {
    setClockToRawTargetWithToast({
      stamina: staminaCurrent,
      position,
      nextPosition,
    })
  }

  return (
    <Card
      title={t('characters.map.clock_section')}
      extra={
        <Popover
          title={t('characters.map.clock_section')}
          content={
            <>
              {t('characters.map.clock_tooltip')
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
                {t('rulebook.clock_footnote')}
              </Typography.Text>
            </>
          }
          trigger='click'
          placement='top'
          styles={{ root: { maxWidth: 360 } }}>
          <HelpButton label={t('rulebook.information')} />
        </Popover>
      }
      actions={[
        <Button
          key='backward'
          type='link'
          htmlType='button'
          onClick={() => setPosition(position - 1)}>
          {t('characters.map.clock_back')}
        </Button>,
        <Space key='display' wrap align='center'>
          <Tag color={isDay ? 'gold' : 'blue'}>{phaseLabel}</Tag>
          <Typography.Text>{clockLabel}</Typography.Text>
        </Space>,
        <Button
          key='forward'
          type='primary'
          htmlType='button'
          onClick={() => setPosition(position + 1)}>
          {t('characters.map.clock_advance')}
        </Button>,
      ]}>
      <ClockDisplay
        label={clockLabel}
        totalSegments={totalSegments}
        segmentsPerHalf={segmentsPerHalf}
        position={position}
      />
      <Form.Item name='clock' hidden>
        <Input />
      </Form.Item>
    </Card>
  )
}
