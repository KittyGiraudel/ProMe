'use client'

import { RedoOutlined } from '@ant-design/icons'
import {
  Card,
  Descriptions,
  Empty,
  Select,
  Space,
  Tooltip,
  Typography,
} from 'antd'
import { type ReactNode, useMemo } from 'react'
import { Button } from '@/components/Button/Button'
import { DiceFaces } from '@/components/DiceFaces/DiceFaces'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import { RichText } from '@/components/RichText/RichText'
import { AGE_BANDS, GENDERS, FACTIONS, RANKS } from '@/lib/constants/misc'
import { lookupName } from '@/lib/inhabitant/data/namesByFaction'
import {
  getAgeBand,
  getPersonality,
  type InhabitantRerollPart,
  type InhabitantRoll,
  setInhabitantAgeBand,
  setInhabitantFaction,
  setInhabitantGender,
  setInhabitantNameDice,
  setInhabitantPersonality,
} from '@/lib/inhabitant/generate'
import { personalityFromRank } from '@/lib/inhabitant/maps'
import {
  type AgeBand,
  type Faction,
  type Gender,
  type Personality,
} from '@/lib/types'
import './InhabitantSummary.css'
import { SelectProps } from 'antd/lib/select'
import { useTranslations } from 'next-intl'

type InhabitantSummaryProps = {
  roll: InhabitantRoll | null
  onRerollPart?: (part: InhabitantRerollPart) => void
  onSetRoll?: (roll: InhabitantRoll) => void
}

export function InhabitantSummary({
  roll,
  onRerollPart,
  onSetRoll,
}: InhabitantSummaryProps) {
  const t = useTranslations()
  const isReadOnly = !onSetRoll
  if (!roll) {
    return (
      <Card
        className='InhabitantSummary InhabitantSummary--empty'
        variant='borderless'>
        <Empty
          description={t('inhabitant.empty_summary', {
            button: t('common.actions.generate'),
          })}
        />
      </Card>
    )
  }

  return (
    <Card className='InhabitantSummary' variant='borderless'>
      <Descriptions
        column={1}
        size='middle'
        className='InhabitantSummary__descriptions'
        styles={{ label: { fontWeight: 600 } }}
        items={[
          {
            key: 'name',
            label: t('inhabitant.section_name'),
            children: (
              <NameRow
                isReadOnly={isReadOnly}
                roll={roll}
                onSetRoll={onSetRoll}
                onRerollPart={onRerollPart}
              />
            ),
          },
          {
            key: 'faction',
            label: t('inhabitant.section_faction'),
            children: (
              <FactionRow
                isReadOnly={isReadOnly}
                roll={roll}
                onSetRoll={onSetRoll}
                onRerollPart={onRerollPart}
              />
            ),
          },
          {
            key: 'gender',
            label: t('inhabitant.section_gender'),
            children: (
              <GenderRow
                isReadOnly={isReadOnly}
                roll={roll}
                onSetRoll={onSetRoll}
                onRerollPart={onRerollPart}
              />
            ),
          },
          {
            key: 'age',
            label: t('inhabitant.section_age'),
            children: (
              <AgeRow
                isReadOnly={isReadOnly}
                roll={roll}
                onSetRoll={onSetRoll}
                onRerollPart={onRerollPart}
              />
            ),
          },
          {
            key: 'personality',
            label: t('inhabitant.section_personality'),
            children: (
              <PersonalityRow
                isReadOnly={isReadOnly}
                roll={roll}
                onSetRoll={onSetRoll}
                onRerollPart={onRerollPart}
              />
            ),
          },
          {
            key: 'context',
            className: 'InhabitantSummary__context-row',
            label: t('inhabitant.section_context'),
            children: (
              <ContextRow
                isReadOnly={isReadOnly}
                roll={roll}
                onRerollPart={onRerollPart}
              />
            ),
          },
        ]}
      />
    </Card>
  )
}

function MetaWithReroll({
  children,
  onReroll,
  rerollLabel,
  isReadOnly,
}: {
  children: ReactNode
  onReroll?: () => void
  rerollLabel: string
  isReadOnly: boolean
}) {
  if (!onReroll || isReadOnly) {
    return <span className='InhabitantSummary__meta'>{children}</span>
  }

  return (
    <span className='InhabitantSummary__meta'>
      <span>{children}</span>
      <Tooltip title={rerollLabel}>
        <Button
          type='text'
          size='small'
          icon={<RedoOutlined />}
          aria-label={rerollLabel}
          onClick={onReroll}
          className='InhabitantSummary__reroll'
        />
      </Tooltip>
    </span>
  )
}

function InhabitantRow({
  display,
  isReadOnly,
  label,
  meta,
  onChange,
  onReroll,
  options,
  type,
  value,
}: {
  display: string
  isReadOnly: boolean
  label: string
  meta: ReactNode
  onChange: SelectProps['onChange']
  onReroll?: VoidFunction
  options: SelectProps['options']
  type: 'card' | 'die' | 'dice'
  value: SelectProps['value']
}) {
  const t = useTranslations()
  return (
    <Space
      orientation='horizontal'
      style={{ width: '100%' }}
      className='InhabitantSummary__row'>
      {isReadOnly ? (
        <Typography.Text>{display}</Typography.Text>
      ) : (
        <Select
          popupMatchSelectWidth={false}
          showSearch={{ optionFilterProp: 'label' }}
          disabled={isReadOnly}
          value={value}
          options={options}
          onChange={onChange}
          aria-label={label}
        />
      )}

      <MetaWithReroll
        isReadOnly={isReadOnly}
        rerollLabel={t(`common.actions.reroll_${type}`)}
        onReroll={onReroll}>
        {meta}
      </MetaWithReroll>
    </Space>
  )
}

function NameRow({
  isReadOnly,
  roll,
  onSetRoll,
  onRerollPart,
}: {
  isReadOnly: boolean
  roll: InhabitantRoll
  onSetRoll: InhabitantSummaryProps['onSetRoll']
  onRerollPart: InhabitantSummaryProps['onRerollPart']
}) {
  const t = useTranslations()
  const nameDiceValue = `${roll.nameDice[0]}-${roll.nameDice[1]}`
  const nameDiceSelectOptions = useMemo(() => {
    if (!roll) return [] as { value: string; label: string }[]
    const opts: { value: string; label: string }[] = []
    for (let d1 = 1; d1 <= 6; d1++) {
      for (let d2 = 1; d2 <= 6; d2++) {
        opts.push({
          value: `${d1}-${d2}`,
          label: lookupName(roll.faction, d1, d2),
        })
      }
    }
    return opts
  }, [roll])

  return (
    <InhabitantRow
      isReadOnly={isReadOnly}
      type='dice'
      meta={t.rich('common.display_2D6', {
        dice: () => <DiceFaces key='dice' values={roll.nameDice} />,
      })}
      onReroll={onRerollPart && (() => onRerollPart('nameDice'))}
      value={nameDiceValue}
      display={roll.name}
      options={nameDiceSelectOptions}
      onChange={v =>
        onSetRoll?.(setInhabitantNameDice(roll, v.split('-').map(Number)))
      }
      label={t('inhabitant.section_name')}
    />
  )
}

function FactionRow({
  isReadOnly,
  roll,
  onSetRoll,
  onRerollPart,
}: {
  isReadOnly: boolean
  roll: InhabitantRoll
  onSetRoll: InhabitantSummaryProps['onSetRoll']
  onRerollPart: InhabitantSummaryProps['onRerollPart']
}) {
  const t = useTranslations()

  return (
    <InhabitantRow
      isReadOnly={isReadOnly}
      type='die'
      meta={t.rich('common.display_1D6', {
        dice: () => <DiceFaces key='dice' values={[roll.factionDie]} />,
      })}
      onReroll={onRerollPart && (() => onRerollPart('faction'))}
      value={roll.faction}
      display={t(`common.factions.${roll.faction}`)}
      options={FACTIONS.map(r => ({
        value: r,
        label: t(`common.factions.${r}`),
      }))}
      onChange={(r: Faction) => onSetRoll?.(setInhabitantFaction(roll, r))}
      label={t('inhabitant.section_faction')}
    />
  )
}

function GenderRow({
  isReadOnly,
  roll,
  onSetRoll,
  onRerollPart,
}: {
  isReadOnly: boolean
  roll: InhabitantRoll
  onSetRoll: InhabitantSummaryProps['onSetRoll']
  onRerollPart: InhabitantSummaryProps['onRerollPart']
}) {
  const t = useTranslations()

  return (
    <InhabitantRow
      isReadOnly={isReadOnly}
      type='die'
      meta={t.rich('common.display_1D6', {
        dice: () => <DiceFaces key='dice' values={[roll.genderDie]} />,
      })}
      onReroll={onRerollPart && (() => onRerollPart('gender'))}
      value={roll.gender}
      display={t(`common.genders.${roll.gender}`)}
      options={GENDERS.map(g => ({
        value: g,
        label: t(`common.genders.${g}`),
      }))}
      onChange={(g: Gender) => onSetRoll?.(setInhabitantGender(roll, g))}
      label={t('inhabitant.section_gender')}
    />
  )
}

function AgeRow({
  isReadOnly,
  roll,
  onSetRoll,
  onRerollPart,
}: {
  isReadOnly: boolean
  roll: InhabitantRoll
  onSetRoll: InhabitantSummaryProps['onSetRoll']
  onRerollPart: InhabitantSummaryProps['onRerollPart']
}) {
  const t = useTranslations()
  const age = getAgeBand(roll)

  return (
    <InhabitantRow
      isReadOnly={isReadOnly}
      type='card'
      meta={t.rich('common.display_card', {
        card: () => <PlayingCardLabel key='card' card={roll.ageCard} />,
      })}
      onReroll={onRerollPart && (() => onRerollPart('ageCard'))}
      value={age}
      display={t(`common.ages.${age}`)}
      options={AGE_BANDS.map(band => ({
        value: band,
        label: t(`common.ages.${band}`),
      }))}
      onChange={(band: AgeBand) =>
        onSetRoll?.(setInhabitantAgeBand(roll, band))
      }
      label={t('inhabitant.section_age')}
    />
  )
}

function PersonalityRow({
  isReadOnly,
  roll,
  onSetRoll,
  onRerollPart,
}: {
  isReadOnly: boolean
  roll: InhabitantRoll
  onSetRoll: InhabitantSummaryProps['onSetRoll']
  onRerollPart: InhabitantSummaryProps['onRerollPart']
}) {
  const gender = roll.gender ?? ('indeterminate' as Gender)
  const t = useTranslations()
  const personality = getPersonality(roll)
  const personalitySelectOptions = useMemo(
    () =>
      RANKS.map(rank => {
        const p = personalityFromRank(rank)
        return {
          value: p,
          label: t(`common.personalities.${p}`, { gender }),
        }
      }),
    [t, gender]
  )

  return (
    <InhabitantRow
      isReadOnly={isReadOnly}
      type='card'
      meta={t.rich('common.display_card', {
        card: () => <PlayingCardLabel key='card' card={roll.personalityCard} />,
      })}
      onReroll={onRerollPart && (() => onRerollPart('personalityCard'))}
      value={personality}
      display={t(`common.personalities.${personality}`, { gender })}
      options={personalitySelectOptions}
      onChange={(p: Personality) =>
        onSetRoll?.(setInhabitantPersonality(roll, p))
      }
      label={t('inhabitant.section_personality')}
    />
  )
}

function ContextRow({
  isReadOnly,
  roll,
  onRerollPart,
}: {
  isReadOnly: boolean
  roll: InhabitantRoll
  onRerollPart: InhabitantSummaryProps['onRerollPart']
}) {
  const t = useTranslations()

  return (
    <div className='InhabitantSummary__stack'>
      <RichText text={roll.contextText} />
      <MetaWithReroll
        isReadOnly={isReadOnly}
        rerollLabel={t('common.actions.reroll_card')}
        onReroll={onRerollPart && (() => onRerollPart('contextCard'))}>
        {t.rich('common.display_card', {
          card: () => (
            <Tooltip key='tooltip' title={t('inhabitant.context_card_note')}>
              <span
                className='InhabitantSummary__context-card-hit'
                tabIndex={0}>
                <PlayingCardLabel card={roll.contextCard} />
              </span>
            </Tooltip>
          ),
        })}
      </MetaWithReroll>
      {roll.contextCard.rank === '7' ? (
        <div className='InhabitantSummary__context-followup'>
          <p className='InhabitantSummary__followup-label'>
            {t('inhabitant.context_seven_followup', {
              value: roll.contextSevenDie ?? 0,
            })}
          </p>
          {roll.contextSevenDie == null ? (
            onRerollPart ? (
              <Button
                size='small'
                type='default'
                onClick={() => onRerollPart('contextSevenDie')}>
                {t('common.actions.reroll_die')}
              </Button>
            ) : null
          ) : (
            <MetaWithReroll
              isReadOnly={isReadOnly}
              rerollLabel={t('common.actions.reroll_die')}
              onReroll={
                onRerollPart && (() => onRerollPart('contextSevenDie'))
              }>
              {t.rich('common.display_1D6', {
                dice: () => (
                  <DiceFaces key='dicefaces' values={[roll.contextSevenDie!]} />
                ),
              })}
            </MetaWithReroll>
          )}
        </div>
      ) : null}
      {roll.contextCard.rank === '10' ? (
        <div className='InhabitantSummary__context-followup'>
          <span className='InhabitantSummary__followup-label'>
            {t('inhabitant.context_spoken_name_label')}
          </span>
          {roll.contextSpokenNameDice == null ? (
            onRerollPart ? (
              <Button
                size='small'
                type='default'
                onClick={() => onRerollPart('contextSpokenNameDice')}>
                {t('common.actions.reroll_dice')}
              </Button>
            ) : null
          ) : (
            <div className='InhabitantSummary__stack InhabitantSummary__stack--tight'>
              <strong className='InhabitantSummary__spoken-name'>
                {roll.contextSpokenName}
              </strong>
              <MetaWithReroll
                isReadOnly={isReadOnly}
                rerollLabel={t('common.actions.reroll_dice')}
                onReroll={
                  onRerollPart && (() => onRerollPart('contextSpokenNameDice'))
                }>
                {t.rich('common.display_2D6', {
                  dice: () => (
                    <DiceFaces
                      key='dicefaces'
                      values={roll.contextSpokenNameDice!}
                    />
                  ),
                })}
              </MetaWithReroll>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
