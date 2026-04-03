'use client'

import { Card, Form, Input, Popover, Tag, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { Button } from '@/components/Button/Button'
import { ClockDisplay } from '@/components/ClockDisplay/ClockDisplay'
import { HelpButton } from '@/components/HelpButton/HelpButton'
import { Spacing } from '@/components/Spacing/Spacing'
import {
  useWatchedClock,
  useWatchedStats,
} from '@/hooks/useCharacterSheetDerived'
import {
  clampClockSliceIndex,
  countHalfClockSegments,
  isClockDayPhase,
} from '@/lib/character/clock'
import { useSetClockToRawTargetWithToast } from '@/lib/character/clockPositionNotifications'

export function ClockCard() {
  const t = useTranslations()
  const form = Form.useFormInstance()
  const clock = useWatchedClock()
  const { stamina } = useWatchedStats()
  const updateClock = useCallback(
    (wrapped: number) => form.setFieldValue('clock', wrapped),
    [form]
  )
  const setClockToRawTargetWithToast = useSetClockToRawTargetWithToast({
    updateClock,
  })
  const segmentsPerHalf = countHalfClockSegments(stamina.current)
  const totalSegments = segmentsPerHalf * 2
  const position = clampClockSliceIndex(stamina.current, clock)
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
      stamina: stamina.current,
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
        <Spacing orientation='horizontal' wrap size='small'>
          <Tag color={isDay ? 'gold' : 'blue'}>{phaseLabel}</Tag>
          <Typography.Text>{clockLabel}</Typography.Text>
        </Spacing>,
        <Button
          key='forward'
          type='primary'
          htmlType='button'
          onClick={() => setPosition(position + 1)}>
          {t('characters.map.clock_advance')}
        </Button>,
      ]}
      id='clock'>
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
