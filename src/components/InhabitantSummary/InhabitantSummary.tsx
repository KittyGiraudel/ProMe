'use client'

import { RedoOutlined } from '@ant-design/icons'
import { useMemo, type ReactNode } from 'react'
import {
  Button,
  Card,
  Descriptions,
  Empty,
  Select,
  Tooltip,
  Typography,
} from 'antd'
import { lookupName } from '@/lib/inhabitant/data/namesByRace'
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
  setInhabitantRace,
} from '@/lib/inhabitant/generate'
import { personalityFromRank } from '@/lib/inhabitant/maps'
import {
  AGE_BANDS,
  GENDERS,
  RACES,
  RANKS,
  type AgeBand,
  type Gender,
  type Personality,
  type Race,
} from '@/lib/types'
import { DiceFaces } from '@/components/DiceFaces/DiceFaces'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import { RichText } from '@/components/RichText/RichText'
import { copy } from '@/messages/fr'
import './InhabitantSummary.css'

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
  const inhabitantFootnote = (
    <Typography.Text type='secondary' className='generator-rulebook-footnote'>
      {copy.rulebook.inhabitantFootnote}
    </Typography.Text>
  )

  const nameDiceSelectOptions = useMemo(() => {
    if (!roll) return [] as { value: string; label: string }[]
    const opts: { value: string; label: string }[] = []
    for (let d1 = 1; d1 <= 6; d1++) {
      for (let d2 = 1; d2 <= 6; d2++) {
        opts.push({
          value: `${d1}-${d2}`,
          label: lookupName(roll.race, d1, d2),
        })
      }
    }
    return opts
  }, [roll])

  const personalitySelectOptions = useMemo(
    () =>
      RANKS.map(rank => {
        const p = personalityFromRank(rank)
        return { value: p, label: copy.personalities[p] }
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
            description={
              <>
                {copy.inhabitant.emptySummaryBefore}
                {copy.inhabitant.rollAll}
                {copy.inhabitant.emptySummaryAfter}
              </>
            }
          />
          <Typography.Text type='secondary'></Typography.Text>
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
              label: copy.inhabitant.sectionName,
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
                    aria-label={copy.inhabitant.sectionName}
                  />
                  <div className='inhabitant-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={copy.inhabitant.rerollName}
                      onReroll={
                        onRerollPart && (() => onRerollPart('nameDice'))
                      }>
                      <>
                        {copy.inhabitant.nameDiceLabel} :{' '}
                        <DiceFaces values={roll.nameDice} />
                      </>
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'race',
              label: copy.inhabitant.sectionRace,
              children: (
                <div className='inhabitant-summary__field-row'>
                  <Select
                    {...INHABITANT_SUMMARY_SELECT_PROPS}
                    className='inhabitant-summary__field-select'
                    disabled={!onSetRoll}
                    value={roll.race}
                    options={RACES.map(r => ({
                      value: r,
                      label: copy.races[r],
                    }))}
                    onChange={(r: Race) => {
                      if (!onSetRoll) return
                      onSetRoll(setInhabitantRace(roll, r))
                    }}
                    aria-label={copy.inhabitant.sectionRace}
                  />
                  <div className='inhabitant-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={copy.inhabitant.rerollRace}
                      onReroll={onRerollPart && (() => onRerollPart('race'))}>
                      <>
                        {copy.inhabitant.raceDieLabel} :{' '}
                        <DiceFaces values={[roll.raceDie]} />
                      </>
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'gender',
              label: copy.inhabitant.sectionGender,
              children: (
                <div className='inhabitant-summary__field-row'>
                  <Select
                    {...INHABITANT_SUMMARY_SELECT_PROPS}
                    className='inhabitant-summary__field-select'
                    disabled={!onSetRoll}
                    value={roll.gender}
                    options={GENDERS.map(g => ({
                      value: g,
                      label: copy.genders[g],
                    }))}
                    onChange={(g: Gender) => {
                      if (!onSetRoll) return
                      onSetRoll(setInhabitantGender(roll, g))
                    }}
                    aria-label={copy.inhabitant.sectionGender}
                  />
                  <div className='inhabitant-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={copy.inhabitant.rerollGender}
                      onReroll={onRerollPart && (() => onRerollPart('gender'))}>
                      <>
                        {copy.inhabitant.raceDieLabel} :{' '}
                        <DiceFaces values={[roll.genderDie]} />
                      </>
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'age',
              label: copy.inhabitant.sectionAge,
              children: (
                <div className='inhabitant-summary__field-row'>
                  <Select
                    {...INHABITANT_SUMMARY_SELECT_PROPS}
                    className='inhabitant-summary__field-select'
                    disabled={!onSetRoll}
                    value={age}
                    options={AGE_BANDS.map(band => ({
                      value: band,
                      label: copy.ageBands[band],
                    }))}
                    onChange={(band: AgeBand) => {
                      if (!onSetRoll) return
                      onSetRoll(setInhabitantAgeBand(roll, band))
                    }}
                    aria-label={copy.inhabitant.sectionAge}
                  />
                  <div className='inhabitant-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={copy.inhabitant.rerollAgeCard}
                      onReroll={
                        onRerollPart && (() => onRerollPart('ageCard'))
                      }>
                      <>
                        {copy.inhabitant.cardLabel} :{' '}
                        <PlayingCardLabel card={roll.ageCard} />
                      </>
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'personality',
              label: copy.inhabitant.sectionPersonality,
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
                    aria-label={copy.inhabitant.sectionPersonality}
                  />
                  <div className='inhabitant-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={copy.inhabitant.rerollPersonalityCard}
                      onReroll={
                        onRerollPart && (() => onRerollPart('personalityCard'))
                      }>
                      <>
                        {copy.inhabitant.cardLabel} :{' '}
                        <PlayingCardLabel card={roll.personalityCard} />
                      </>
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'context',
              label: copy.inhabitant.sectionContext,
              children: (
                <div className='inhabitant-summary__stack'>
                  <RichText
                    as='p'
                    text={roll.contextText}
                    className='inhabitant-summary__context'
                  />
                  <MetaWithReroll
                    rerollLabel={copy.inhabitant.rerollContextCard}
                    onReroll={
                      onRerollPart && (() => onRerollPart('contextCard'))
                    }>
                    <>
                      {copy.inhabitant.cardLabel} :{' '}
                      <Tooltip title={copy.inhabitant.contextCardNote}>
                        <span
                          className='inhabitant-summary__context-card-hit'
                          tabIndex={0}>
                          <PlayingCardLabel card={roll.contextCard} />
                        </span>
                      </Tooltip>
                    </>
                  </MetaWithReroll>
                  {roll.contextCard.rank === '7' ? (
                    <div className='inhabitant-summary__context-followup'>
                      <span className='inhabitant-summary__followup-label'>
                        {copy.inhabitant.contextSevenFollowupLabel}
                      </span>
                      {roll.contextSevenDie == null ? (
                        onRerollPart ? (
                          <Button
                            size='small'
                            type='default'
                            onClick={() => onRerollPart('contextSevenDie')}>
                            {copy.inhabitant.rollContextSevenDie}
                          </Button>
                        ) : null
                      ) : (
                        <MetaWithReroll
                          rerollLabel={copy.inhabitant.rerollContextSevenDie}
                          onReroll={
                            onRerollPart &&
                            (() => onRerollPart('contextSevenDie'))
                          }>
                          <>
                            <strong>
                              {mapKindFromContextSevenDie(
                                roll.contextSevenDie
                              ) === 'localisation'
                                ? copy.inhabitant.contextSevenMapLocalisation
                                : copy.inhabitant.contextSevenMapBiome}
                            </strong>
                            {' · '}
                            {copy.inhabitant.raceDieLabel} :{' '}
                            <DiceFaces values={[roll.contextSevenDie]} />
                          </>
                        </MetaWithReroll>
                      )}
                    </div>
                  ) : null}
                  {roll.contextCard.rank === '10' ? (
                    <div className='inhabitant-summary__context-followup'>
                      <span className='inhabitant-summary__followup-label'>
                        {copy.inhabitant.contextSpokenNameLabel}
                      </span>
                      {roll.contextSpokenNameDice == null ? (
                        onRerollPart ? (
                          <Button
                            size='small'
                            type='default'
                            onClick={() =>
                              onRerollPart('contextSpokenNameDice')
                            }>
                            {copy.inhabitant.rollContextSpokenNameDice}
                          </Button>
                        ) : null
                      ) : (
                        <div className='inhabitant-summary__stack inhabitant-summary__stack--tight'>
                          <strong className='inhabitant-summary__spoken-name'>
                            {roll.contextSpokenName}
                          </strong>
                          <MetaWithReroll
                            rerollLabel={
                              copy.inhabitant.rerollContextSpokenNameDice
                            }
                            onReroll={
                              onRerollPart &&
                              (() => onRerollPart('contextSpokenNameDice'))
                            }>
                            <>
                              {copy.inhabitant.nameDiceLabel} :{' '}
                              <DiceFaces values={roll.contextSpokenNameDice} />
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
