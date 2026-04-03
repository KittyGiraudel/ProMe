'use client'

import { Card, Empty, Tooltip } from 'antd'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { DiceFaces } from '@/components/DiceFaces/DiceFaces'
import { HelpButton } from '@/components/HelpButton/HelpButton'
import { useAnimatedValue } from '@/hooks/useAnimatedValue'
import { rollD6 } from '@/lib/random/rng'

import './DiceRoll.css'

export function DiceRoll() {
  const t = useTranslations()
  const {
    value: dieValue,
    isAnimating: isRollingDie,
    start: handleRollDie,
  } = useAnimatedValue(() => rollD6(Math.random))

  return (
    <Card
      className='DiceRoll__card'
      title={t('characters.tools.die_title')}
      extra={
        <Tooltip title={t('characters.tools.die_tooltip')}>
          <HelpButton label={t('common.tip')} />
        </Tooltip>
      }
      actions={[
        <Button
          key='action'
          onClick={handleRollDie}
          loading={isRollingDie}
          type='link'
          disabled={false}>
          {isRollingDie
            ? t('characters.tools.die_rolling')
            : t('characters.tools.die_action')}
        </Button>,
      ]}>
      <div
        className={[
          'DiceRoll__value',
          isRollingDie ? 'DiceRoll__value--rolling' : '',
        ]
          .filter(Boolean)
          .join(' ')}>
        {dieValue === null ? (
          <Empty description={t('characters.tools.die_empty')} />
        ) : (
          <DiceFaces values={[dieValue]} className='DiceRoll__face' />
        )}
      </div>
    </Card>
  )
}
