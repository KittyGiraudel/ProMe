'use client'

import { Button, Card, Empty } from 'antd'
import { useTranslations } from 'next-intl'
import { DiceFaces } from '@/components/DiceFaces/DiceFaces'
import { useSettings } from '@/components/PageSettings/SettingsContext'
import { useAnimatedValue } from '@/hooks/useAnimatedValue'
import { useModifierKey } from '@/hooks/useModifierKey'
import { rollD6 } from '@/lib/random/rng'

import './DiceRoll.css'

export function DiceRoll() {
  const { settings } = useSettings()
  const modifier = useModifierKey()
  const t = useTranslations()
  const {
    value: dieValue,
    isAnimating: isRollingDie,
    start: handleRollDie,
  } = useAnimatedValue(() => rollD6(Math.random))

  return (
    <Card
      className='DiceRoll__card'
      title={<h2>{t('characters.tools.die_title')}</h2>}
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
          <Empty
            description={
              settings.shortcuts.enabled
                ? t('characters.tools.die_tooltip', { modifier })
                : t('characters.tools.die_empty')
            }
          />
        ) : (
          <DiceFaces values={[dieValue]} className='DiceRoll__face' />
        )}
      </div>
    </Card>
  )
}
