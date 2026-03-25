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
import { useLocalize } from '@/app/contexts/LocalizationContext'

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
  const localize = useLocalize()
  const inhabitantFootnote = (
    <Typography.Text type='secondary' className='generator-rulebook-footnote'>
      {localize.string('rulebook.inhabitantFootnote')}
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
        return { value: p, label: localize.string(`personalities.${p}`) }
      }),
    []
  )

  if (!roll) {
    return (
      <>
        <Card
          className='inhabitant-summary inhabitant-summary--empty'
          variant='borderless'>
          <Empty
            description={localize.string('inhabitant.emptySummary', {
              button: localize.string('inhabitant.generate'),
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
              label: localize.string('inhabitant.sectionName'),
              children: (
                <div className='inhabitant-summary__field-row'>
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
                    aria-label={localize.string('inhabitant.sectionName')}
                  />
                  <div className='inhabitant-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={localize.string('inhabitant.rerollName')}
                      onReroll={
                        onRerollPart && (() => onRerollPart('nameDice'))
                      }>
                      <>
                        {localize.template('inhabitant.nameDiceMeta', {
                          dice: <DiceFaces values={roll.nameDice} />,
                        })}
                      </>
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'faction',
              label: localize.string('inhabitant.sectionFaction'),
              children: (
                <div className='inhabitant-summary__field-row'>
                  <Select
                    {...INHABITANT_SUMMARY_SELECT_PROPS}
                    className='inhabitant-summary__field-select'
                    disabled={!onSetRoll}
                    value={roll.faction}
                    options={FACTIONS.map(r => ({
                      value: r,
                      label: localize.string(`factions.${r}`),
                    }))}
                    onChange={(r: Faction) => {
                      if (!onSetRoll) return
                      onSetRoll(setInhabitantFaction(roll, r))
                    }}
                    aria-label={localize.string('inhabitant.sectionFaction')}
                  />
                  <div className='inhabitant-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={localize.string('inhabitant.rerollFaction')}
                      onReroll={
                        onRerollPart && (() => onRerollPart('faction'))
                      }>
                      <>
                        {localize.template('inhabitant.factionDieMeta', {
                          dice: <DiceFaces values={[roll.factionDie]} />,
                        })}
                      </>
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'gender',
              label: localize.string('inhabitant.sectionGender'),
              children: (
                <div className='inhabitant-summary__field-row'>
                  <Select
                    {...INHABITANT_SUMMARY_SELECT_PROPS}
                    className='inhabitant-summary__field-select'
                    disabled={!onSetRoll}
                    value={roll.gender}
                    options={GENDERS.map(g => ({
                      value: g,
                      label: localize.string(`genders.${g}`),
                    }))}
                    onChange={(g: Gender) => {
                      if (!onSetRoll) return
                      onSetRoll(setInhabitantGender(roll, g))
                    }}
                    aria-label={localize.string('inhabitant.sectionGender')}
                  />
                  <div className='inhabitant-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={localize.string('inhabitant.rerollGender')}
                      onReroll={onRerollPart && (() => onRerollPart('gender'))}>
                      <>
                        {localize.template('inhabitant.factionDieMeta', {
                          dice: <DiceFaces values={[roll.genderDie]} />,
                        })}
                      </>
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'age',
              label: localize.string('inhabitant.sectionAge'),
              children: (
                <div className='inhabitant-summary__field-row'>
                  <Select
                    {...INHABITANT_SUMMARY_SELECT_PROPS}
                    className='inhabitant-summary__field-select'
                    disabled={!onSetRoll}
                    value={age}
                    options={AGE_BANDS.map(band => ({
                      value: band,
                      label: localize.string(`ageBands.${band}`),
                    }))}
                    onChange={(band: AgeBand) => {
                      if (!onSetRoll) return
                      onSetRoll(setInhabitantAgeBand(roll, band))
                    }}
                    aria-label={localize.string('inhabitant.sectionAge')}
                  />
                  <div className='inhabitant-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={localize.string('inhabitant.rerollAgeCard')}
                      onReroll={
                        onRerollPart && (() => onRerollPart('ageCard'))
                      }>
                      <>
                        {localize.template('inhabitant.cardMeta', {
                          card: <PlayingCardLabel card={roll.ageCard} />,
                        })}
                      </>
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'personality',
              label: localize.string('inhabitant.sectionPersonality'),
              children: (
                <div className='inhabitant-summary__field-row'>
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
                    aria-label={localize.string(
                      'inhabitant.sectionPersonality'
                    )}
                  />
                  <div className='inhabitant-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={localize.string(
                        'inhabitant.rerollPersonalityCard'
                      )}
                      onReroll={
                        onRerollPart && (() => onRerollPart('personalityCard'))
                      }>
                      <>
                        {localize.template('inhabitant.cardMeta', {
                          card: (
                            <PlayingCardLabel card={roll.personalityCard} />
                          ),
                        })}
                      </>
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'context',
              label: localize.string('inhabitant.sectionContext'),
              children: (
                <div className='inhabitant-summary__stack'>
                  <RichText
                    as='p'
                    text={roll.contextText}
                    className='inhabitant-summary__context'
                  />
                  <MetaWithReroll
                    rerollLabel={localize.string(
                      'inhabitant.rerollContextCard'
                    )}
                    onReroll={
                      onRerollPart && (() => onRerollPart('contextCard'))
                    }>
                    <>
                      {localize.template('inhabitant.cardMeta', {
                        card: (
                          <Tooltip
                            title={localize.string(
                              'inhabitant.contextCardNote'
                            )}>
                            <span
                              className='inhabitant-summary__context-card-hit'
                              tabIndex={0}>
                              <PlayingCardLabel card={roll.contextCard} />
                            </span>
                          </Tooltip>
                        ),
                      })}
                    </>
                  </MetaWithReroll>
                  {roll.contextCard.rank === '7' ? (
                    <div className='inhabitant-summary__context-followup'>
                      <span className='inhabitant-summary__followup-label'>
                        {localize.string(
                          'inhabitant.contextSevenFollowupLabel'
                        )}
                      </span>
                      {roll.contextSevenDie == null ? (
                        onRerollPart ? (
                          <Button
                            size='small'
                            type='default'
                            onClick={() => onRerollPart('contextSevenDie')}>
                            {localize.string('inhabitant.rollContextSevenDie')}
                          </Button>
                        ) : null
                      ) : (
                        <MetaWithReroll
                          rerollLabel={localize.string(
                            'inhabitant.rerollContextSevenDie'
                          )}
                          onReroll={
                            onRerollPart &&
                            (() => onRerollPart('contextSevenDie'))
                          }>
                          <>
                            <strong>
                              {mapKindFromContextSevenDie(
                                roll.contextSevenDie
                              ) === 'localisation'
                                ? localize.string(
                                    'inhabitant.contextSevenMapLocalisation'
                                  )
                                : localize.string(
                                    'inhabitant.contextSevenMapBiome'
                                  )}
                            </strong>
                            {' · '}
                            {localize.template('inhabitant.factionDieMeta', {
                              dice: (
                                <DiceFaces values={[roll.contextSevenDie]} />
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
                        {localize.string('inhabitant.contextSpokenNameLabel')}
                      </span>
                      {roll.contextSpokenNameDice == null ? (
                        onRerollPart ? (
                          <Button
                            size='small'
                            type='default'
                            onClick={() =>
                              onRerollPart('contextSpokenNameDice')
                            }>
                            {localize.string(
                              'inhabitant.rollContextSpokenNameDice'
                            )}
                          </Button>
                        ) : null
                      ) : (
                        <div className='inhabitant-summary__stack inhabitant-summary__stack--tight'>
                          <strong className='inhabitant-summary__spoken-name'>
                            {roll.contextSpokenName}
                          </strong>
                          <MetaWithReroll
                            rerollLabel={localize.string(
                              'inhabitant.rerollContextSpokenNameDice'
                            )}
                            onReroll={
                              onRerollPart &&
                              (() => onRerollPart('contextSpokenNameDice'))
                            }>
                            <>
                              {localize.template('inhabitant.nameDiceMeta', {
                                dice: (
                                  <DiceFaces
                                    values={roll.contextSpokenNameDice}
                                  />
                                ),
                              })}
                            </>
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
