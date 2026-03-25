'use client'

import { RedoOutlined } from '@ant-design/icons'
import { useMemo, type ReactNode } from 'react'
import { Card, Descriptions, Empty, Select, Tooltip, Typography } from 'antd'
import { lookupName } from '@/lib/inhabitant/data/namesByFaction'
import {
  type InhabitantRerollPart,
  type InhabitantRoll,
  getAgeBand,
  getPersonality,
  mapKindFromContextSevenDie,
  setInhabitantAgeBand,
  setInhabitantGender,
  setInhabitantNameDice,
  setInhabitantPersonality,
  setInhabitantFaction,
} from '@/lib/inhabitant/generate'
import { personalityFromRank } from '@/lib/inhabitant/maps'
import {
  AGE_BANDS,
  GENDERS,
  FACTIONS,
  RANKS,
  type AgeBand,
  type Gender,
  type Personality,
  type Faction,
} from '@/lib/types'
import { DiceFaces } from '@/components/DiceFaces/DiceFaces'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import { RichText } from '@/components/RichText/RichText'
import { Button } from '@/components/Button/Button'
import './InhabitantSummary.css'
import { useTranslations } from 'next-intl'

/** Wider popup than the trigger + full option labels (antd defaults ellipsis). */
const INHABITANT_SUMMARY_SELECT_PROPS = {
  popupMatchSelectWidth: false as const,
  classNames: { popup: { root: 'inhabitant-summary__select-popup' } },
}

type InhabitantSummaryProps = {
  roll: InhabitantRoll | null
  onRerollPart?: (part: InhabitantRerollPart) => void
  onSetRoll?: (roll: InhabitantRoll) => void
}

function MetaWithReroll({
  children,
  onReroll,
  rerollLabel,
}: {
  children: ReactNode
  onReroll?: () => void
  rerollLabel: string
}) {
  if (!onReroll) {
    return <span className='inhabitant-summary__meta'>{children}</span>
  }
  return (
    <span className='inhabitant-summary__meta inhabitant-summary__meta--with-action'>
      <span className='inhabitant-summary__meta-main'>{children}</span>
      <Tooltip title={rerollLabel}>
        <Button
          type='text'
          size='small'
          icon={<RedoOutlined />}
          aria-label={rerollLabel}
          onClick={onReroll}
          className='inhabitant-summary__reroll'
        />
      </Tooltip>
    </span>
  )
}

export function InhabitantSummary({
  roll,
  onRerollPart,
  onSetRoll,
}: InhabitantSummaryProps) {
  const t = useTranslations()
  const isReadOnly = !onSetRoll
  const inhabitantFootnote = (
    <Typography.Text type='secondary' className='generator-rulebook-footnote'>
      {t('rulebook.inhabitant_footnote')}
    </Typography.Text>
  )

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

  const personalitySelectOptions = useMemo(
    () =>
      RANKS.map(rank => {
        const p = personalityFromRank(rank)
        return { value: p, label: t(`common.personalities.${p}`) }
      }),
    [t]
  )

  if (!roll) {
    return (
      <>
        <Card
          className='inhabitant-summary inhabitant-summary--empty'
          variant='borderless'>
          <Empty
            description={t('inhabitant.empty_summary', {
              button: t('inhabitant.generate'),
            })}
          />
        </Card>
        {inhabitantFootnote}
      </>
    )
  }

  const age = getAgeBand(roll)
  const personality = getPersonality(roll)
  const nameDiceValue = `${roll.nameDice[0]}-${roll.nameDice[1]}`

  return (
    <>
      <Card className='inhabitant-summary' variant='borderless'>
        <Descriptions
          column={1}
          size='middle'
          styles={{ label: { fontWeight: 600, width: '11rem' } }}
          className='inhabitant-summary__descriptions'
          items={[
            {
              key: 'name',
              label: t('inhabitant.section_name'),
              children: (
                <div className='inhabitant-summary__field-row'>
                  {isReadOnly ? (
                    <Typography.Text>{roll.name}</Typography.Text>
                  ) : (
                    <Select
                      {...INHABITANT_SUMMARY_SELECT_PROPS}
                      className='inhabitant-summary__field-select'
                      showSearch
                      optionFilterProp='label'
                      disabled={!onSetRoll}
                      value={nameDiceValue}
                      options={nameDiceSelectOptions}
                      onChange={v => {
                        if (!onSetRoll) return
                        const [a, b] = v.split('-').map(Number) as [
                          number,
                          number,
                        ]
                        onSetRoll(setInhabitantNameDice(roll, [a, b]))
                      }}
                      aria-label={t('inhabitant.section_name')}
                    />
                  )}
                  <div className='inhabitant-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={t('inhabitant.reroll_name')}
                      onReroll={
                        onRerollPart && (() => onRerollPart('nameDice'))
                      }>
                      {t.rich('inhabitant.name_dice_meta', {
                        dice: () => (
                          <DiceFaces key='dice' values={roll.nameDice} />
                        ),
                      })}
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'faction',
              label: t('inhabitant.section_faction'),
              children: (
                <div className='inhabitant-summary__field-row'>
                  {isReadOnly ? (
                    <Typography.Text>
                      {t(`common.factions.${roll.faction}`)}
                    </Typography.Text>
                  ) : (
                    <Select
                      {...INHABITANT_SUMMARY_SELECT_PROPS}
                      className='inhabitant-summary__field-select'
                      disabled={!onSetRoll}
                      value={roll.faction}
                      options={FACTIONS.map(r => ({
                        value: r,
                        label: t(`common.factions.${r}`),
                      }))}
                      onChange={(r: Faction) => {
                        if (!onSetRoll) return
                        onSetRoll(setInhabitantFaction(roll, r))
                      }}
                      aria-label={t('inhabitant.section_faction')}
                    />
                  )}
                  <div className='inhabitant-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={t('inhabitant.reroll_faction')}
                      onReroll={
                        onRerollPart && (() => onRerollPart('faction'))
                      }>
                      {t.rich('inhabitant.faction_die_meta', {
                        dice: () => <DiceFaces values={[roll.factionDie]} />,
                      })}
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'gender',
              label: t('inhabitant.section_gender'),
              children: (
                <div className='inhabitant-summary__field-row'>
                  {isReadOnly ? (
                    <Typography.Text>
                      {t(`common.genders.${roll.gender}`)}
                    </Typography.Text>
                  ) : (
                    <Select
                      {...INHABITANT_SUMMARY_SELECT_PROPS}
                      className='inhabitant-summary__field-select'
                      disabled={!onSetRoll}
                      value={roll.gender}
                      options={GENDERS.map(g => ({
                        value: g,
                        label: t(`common.genders.${g}`),
                      }))}
                      onChange={(g: Gender) => {
                        if (!onSetRoll) return
                        onSetRoll(setInhabitantGender(roll, g))
                      }}
                      aria-label={t('inhabitant.section_gender')}
                    />
                  )}
                  <div className='inhabitant-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={t('inhabitant.reroll_gender')}
                      onReroll={onRerollPart && (() => onRerollPart('gender'))}>
                      {t.rich('inhabitant.faction_die_meta', {
                        dice: () => (
                          <DiceFaces key='dice' values={[roll.genderDie]} />
                        ),
                      })}
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'age',
              label: t('inhabitant.section_age'),
              children: (
                <div className='inhabitant-summary__field-row'>
                  {isReadOnly ? (
                    <Typography.Text>
                      {t(`common.age_bands.${age}`)}
                    </Typography.Text>
                  ) : (
                    <Select
                      {...INHABITANT_SUMMARY_SELECT_PROPS}
                      className='inhabitant-summary__field-select'
                      disabled={!onSetRoll}
                      value={age}
                      options={AGE_BANDS.map(band => ({
                        value: band,
                        label: t(`common.age_bands.${band}`),
                      }))}
                      onChange={(band: AgeBand) => {
                        if (!onSetRoll) return
                        onSetRoll(setInhabitantAgeBand(roll, band))
                      }}
                      aria-label={t('inhabitant.section_age')}
                    />
                  )}
                  <div className='inhabitant-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={t('inhabitant.reroll_age_card')}
                      onReroll={
                        onRerollPart && (() => onRerollPart('ageCard'))
                      }>
                      {t.rich('inhabitant.card_meta', {
                        card: () => (
                          <PlayingCardLabel key='card' card={roll.ageCard} />
                        ),
                      })}
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'personality',
              label: t('inhabitant.section_personality'),
              children: (
                <div className='inhabitant-summary__field-row'>
                  {isReadOnly ? (
                    <Typography.Text>
                      {t(`common.personalities.${personality}`)}
                    </Typography.Text>
                  ) : (
                    <Select
                      {...INHABITANT_SUMMARY_SELECT_PROPS}
                      className='inhabitant-summary__field-select'
                      disabled={!onSetRoll}
                      value={personality}
                      options={personalitySelectOptions}
                      onChange={(p: Personality) => {
                        if (!onSetRoll) return
                        onSetRoll(setInhabitantPersonality(roll, p))
                      }}
                      aria-label={t('inhabitant.section_personality')}
                    />
                  )}
                  <div className='inhabitant-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={t('inhabitant.reroll_personality_card')}
                      onReroll={
                        onRerollPart && (() => onRerollPart('personalityCard'))
                      }>
                      {t.rich('inhabitant.card_meta', {
                        card: () => (
                          <PlayingCardLabel
                            key='card'
                            card={roll.personalityCard}
                          />
                        ),
                      })}
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'context',
              label: t('inhabitant.section_context'),
              children: (
                <div className='inhabitant-summary__stack'>
                  <RichText text={roll.contextText} />
                  <MetaWithReroll
                    rerollLabel={t('inhabitant.reroll_context_card')}
                    onReroll={
                      onRerollPart && (() => onRerollPart('contextCard'))
                    }>
                    {t.rich('inhabitant.card_meta', {
                      card: () => (
                        <Tooltip
                          key='tooltip'
                          title={t('inhabitant.context_card_note')}>
                          <span
                            className='inhabitant-summary__context-card-hit'
                            tabIndex={0}>
                            <PlayingCardLabel card={roll.contextCard} />
                          </span>
                        </Tooltip>
                      ),
                    })}
                  </MetaWithReroll>
                  {roll.contextCard.rank === '7' ? (
                    <div className='inhabitant-summary__context-followup'>
                      <span className='inhabitant-summary__followup-label'>
                        {t('inhabitant.context_seven_followup_label')}
                      </span>
                      {roll.contextSevenDie == null ? (
                        onRerollPart ? (
                          <Button
                            size='small'
                            type='default'
                            onClick={() => onRerollPart('contextSevenDie')}>
                            {t('inhabitant.roll_context_seven_die')}
                          </Button>
                        ) : null
                      ) : (
                        <MetaWithReroll
                          rerollLabel={t('inhabitant.reroll_context_seven_die')}
                          onReroll={
                            onRerollPart &&
                            (() => onRerollPart('contextSevenDie'))
                          }>
                          <>
                            <strong>
                              {mapKindFromContextSevenDie(
                                roll.contextSevenDie
                              ) === 'localisation'
                                ? t('inhabitant.context_seven_map_localisation')
                                : t('inhabitant.context_seven_map_biome')}
                            </strong>
                            {' · '}
                            {t.rich('inhabitant.faction_die_meta', {
                              dice: () => (
                                <DiceFaces
                                  key='dicefaces'
                                  values={[roll.contextSevenDie!]}
                                />
                              ),
                            })}
                          </>
                        </MetaWithReroll>
                      )}
                    </div>
                  ) : null}
                  {roll.contextCard.rank === '10' ? (
                    <div className='inhabitant-summary__context-followup'>
                      <span className='inhabitant-summary__followup-label'>
                        {t('inhabitant.context_spoken_name_label')}
                      </span>
                      {roll.contextSpokenNameDice == null ? (
                        onRerollPart ? (
                          <Button
                            size='small'
                            type='default'
                            onClick={() =>
                              onRerollPart('contextSpokenNameDice')
                            }>
                            {t('inhabitant.roll_context_spoken_name_dice')}
                          </Button>
                        ) : null
                      ) : (
                        <div className='inhabitant-summary__stack inhabitant-summary__stack--tight'>
                          <strong className='inhabitant-summary__spoken-name'>
                            {roll.contextSpokenName}
                          </strong>
                          <MetaWithReroll
                            rerollLabel={t(
                              'inhabitant.reroll_context_spoken_name_dice'
                            )}
                            onReroll={
                              onRerollPart &&
                              (() => onRerollPart('contextSpokenNameDice'))
                            }>
                            {t.rich('inhabitant.name_dice_meta', {
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
              ),
            },
          ]}
        />
      </Card>
      {inhabitantFootnote}
    </>
  )
}
