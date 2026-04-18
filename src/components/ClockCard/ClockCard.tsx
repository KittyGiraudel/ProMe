'use client'

import { Card, Form, Input, Popover, Tag, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { ClockDisplay } from '@/components/ClockDisplay/ClockDisplay'
import { HelpButton } from '@/components/HelpButton/HelpButton'
import {
  useWatchedClock,
  useWatchedStamina,
} from '@/hooks/useCharacterSheetDerived'
import { useSetClockToRawTargetWithToast } from '@/hooks/useSetClockToRawTargetWithToast'
import {
  clampClockSliceIndex,
  countHalfClockSegments,
  isClockDayPhase,
} from '@/lib/clock/clock'

import './ClockCard.css'

export function ClockCard() {
  const t = useTranslations()
  const { clock } = useWatchedClock()
  const { stamina } = useWatchedStamina()
  const setClockToRawTargetWithToast = useSetClockToRawTargetWithToast()
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
          styles={{ root: { maxWidth: 'min(360px, 90vw)' } }}>
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
        <span className='ClockCard__Label' key='label'>
          <Tag color={isDay ? 'gold' : 'blue'} variant='outlined'>
            {phaseLabel}
          </Tag>
          <Typography.Text>{clockLabel}</Typography.Text>
        </span>,
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
