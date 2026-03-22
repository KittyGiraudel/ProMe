'use client'

import { RedoOutlined } from '@ant-design/icons'
import { useMemo, type ReactNode } from 'react'
import { Button, Card, Descriptions, Select, Tooltip, Typography } from 'antd'
import { lookupName } from '@/lib/character/data/namesByRace'
import {
  type CharacterRerollPart,
  type CharacterRoll,
  getAgeBand,
  getPersonality,
  mapKindFromContextSevenDie,
  setCharacterAgeBand,
  setCharacterGender,
  setCharacterNameDice,
  setCharacterPersonality,
  setCharacterRace,
} from '@/lib/character/generate'
import { personalityFromRank } from '@/lib/character/maps'
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
import './CharacterSummary.css'

/** Wider popup than the trigger + full option labels (antd defaults ellipsis). */
const CHARACTER_SUMMARY_SELECT_PROPS = {
  popupMatchSelectWidth: false as const,
  classNames: { popup: { root: 'character-summary__select-popup' } },
}

type CharacterSummaryProps = {
  roll: CharacterRoll | null
  onRerollPart?: (part: CharacterRerollPart) => void
  onSetRoll?: (roll: CharacterRoll) => void
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
    return <span className='character-summary__meta'>{children}</span>
  }
  return (
    <span className='character-summary__meta character-summary__meta--with-action'>
      <span className='character-summary__meta-main'>{children}</span>
      <Tooltip title={rerollLabel}>
        <Button
          type='text'
          size='small'
          icon={<RedoOutlined />}
          aria-label={rerollLabel}
          onClick={onReroll}
          className='character-summary__reroll'
        />
      </Tooltip>
    </span>
  )
}

export function CharacterSummary({
  roll,
  onRerollPart,
  onSetRoll,
}: CharacterSummaryProps) {
  const characterFootnote = (
    <Typography.Text type='secondary' className='generator-rulebook-footnote'>
      {copy.rulebook.characterFootnote}
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
          className='character-summary character-summary--empty'
          variant='borderless'>
          <Typography.Text type='secondary'>
            {copy.character.emptySummaryBefore}
            {copy.character.rollAll}
            {copy.character.emptySummaryAfter}
          </Typography.Text>
        </Card>
        {characterFootnote}
      </>
    )
  }

  const age = getAgeBand(roll)
  const personality = getPersonality(roll)
  const nameDiceValue = `${roll.nameDice[0]}-${roll.nameDice[1]}`

  return (
    <>
      <Card className='character-summary' variant='borderless'>
        <Descriptions
          column={1}
          size='middle'
          styles={{ label: { fontWeight: 600, width: '11rem' } }}
          className='character-summary__descriptions'
          items={[
            {
              key: 'name',
              label: copy.character.sectionName,
              children: (
                <div className='character-summary__field-row'>
                  <Select
                    {...CHARACTER_SUMMARY_SELECT_PROPS}
                    className='character-summary__field-select'
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
                      onSetRoll(setCharacterNameDice(roll, [a, b]))
                    }}
                    aria-label={copy.character.sectionName}
                  />
                  <div className='character-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={copy.character.rerollName}
                      onReroll={
                        onRerollPart && (() => onRerollPart('nameDice'))
                      }>
                      <>
                        {copy.character.nameDiceLabel} :{' '}
                        <DiceFaces values={roll.nameDice} />
                      </>
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'race',
              label: copy.character.sectionRace,
              children: (
                <div className='character-summary__field-row'>
                  <Select
                    {...CHARACTER_SUMMARY_SELECT_PROPS}
                    className='character-summary__field-select'
                    disabled={!onSetRoll}
                    value={roll.race}
                    options={RACES.map(r => ({
                      value: r,
                      label: copy.races[r],
                    }))}
                    onChange={(r: Race) => {
                      if (!onSetRoll) return
                      onSetRoll(setCharacterRace(roll, r))
                    }}
                    aria-label={copy.character.sectionRace}
                  />
                  <div className='character-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={copy.character.rerollRace}
                      onReroll={onRerollPart && (() => onRerollPart('race'))}>
                      <>
                        {copy.character.raceDieLabel} :{' '}
                        <DiceFaces values={[roll.raceDie]} />
                      </>
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'gender',
              label: copy.character.sectionGender,
              children: (
                <div className='character-summary__field-row'>
                  <Select
                    {...CHARACTER_SUMMARY_SELECT_PROPS}
                    className='character-summary__field-select'
                    disabled={!onSetRoll}
                    value={roll.gender}
                    options={GENDERS.map(g => ({
                      value: g,
                      label: copy.genders[g],
                    }))}
                    onChange={(g: Gender) => {
                      if (!onSetRoll) return
                      onSetRoll(setCharacterGender(roll, g))
                    }}
                    aria-label={copy.character.sectionGender}
                  />
                  <div className='character-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={copy.character.rerollGender}
                      onReroll={onRerollPart && (() => onRerollPart('gender'))}>
                      <>
                        {copy.character.raceDieLabel} :{' '}
                        <DiceFaces values={[roll.genderDie]} />
                      </>
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'age',
              label: copy.character.sectionAge,
              children: (
                <div className='character-summary__field-row'>
                  <Select
                    {...CHARACTER_SUMMARY_SELECT_PROPS}
                    className='character-summary__field-select'
                    disabled={!onSetRoll}
                    value={age}
                    options={AGE_BANDS.map(band => ({
                      value: band,
                      label: copy.ageBands[band],
                    }))}
                    onChange={(band: AgeBand) => {
                      if (!onSetRoll) return
                      onSetRoll(setCharacterAgeBand(roll, band))
                    }}
                    aria-label={copy.character.sectionAge}
                  />
                  <div className='character-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={copy.character.rerollAgeCard}
                      onReroll={
                        onRerollPart && (() => onRerollPart('ageCard'))
                      }>
                      <>
                        {copy.character.cardLabel} :{' '}
                        <PlayingCardLabel card={roll.ageCard} />
                      </>
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'personality',
              label: copy.character.sectionPersonality,
              children: (
                <div className='character-summary__field-row'>
                  <Select
                    {...CHARACTER_SUMMARY_SELECT_PROPS}
                    className='character-summary__field-select'
                    disabled={!onSetRoll}
                    value={personality}
                    options={personalitySelectOptions}
                    onChange={(p: Personality) => {
                      if (!onSetRoll) return
                      onSetRoll(setCharacterPersonality(roll, p))
                    }}
                    aria-label={copy.character.sectionPersonality}
                  />
                  <div className='character-summary__field-meta'>
                    <MetaWithReroll
                      rerollLabel={copy.character.rerollPersonalityCard}
                      onReroll={
                        onRerollPart && (() => onRerollPart('personalityCard'))
                      }>
                      <>
                        {copy.character.cardLabel} :{' '}
                        <PlayingCardLabel card={roll.personalityCard} />
                      </>
                    </MetaWithReroll>
                  </div>
                </div>
              ),
            },
            {
              key: 'context',
              label: copy.character.sectionContext,
              children: (
                <div className='character-summary__stack'>
                  <RichText
                    as='p'
                    text={roll.contextText}
                    className='character-summary__context'
                  />
                  <MetaWithReroll
                    rerollLabel={copy.character.rerollContextCard}
                    onReroll={
                      onRerollPart && (() => onRerollPart('contextCard'))
                    }>
                    <>
                      {copy.character.cardLabel} :{' '}
                      <Tooltip title={copy.character.contextCardNote}>
                        <span
                          className='character-summary__context-card-hit'
                          tabIndex={0}>
                          <PlayingCardLabel card={roll.contextCard} />
                        </span>
                      </Tooltip>
                    </>
                  </MetaWithReroll>
                  {roll.contextCard.rank === '7' ? (
                    <div className='character-summary__context-followup'>
                      <span className='character-summary__followup-label'>
                        {copy.character.contextSevenFollowupLabel}
                      </span>
                      {roll.contextSevenDie == null ? (
                        onRerollPart ? (
                          <Button
                            size='small'
                            type='default'
                            onClick={() => onRerollPart('contextSevenDie')}>
                            {copy.character.rollContextSevenDie}
                          </Button>
                        ) : null
                      ) : (
                        <MetaWithReroll
                          rerollLabel={copy.character.rerollContextSevenDie}
                          onReroll={
                            onRerollPart &&
                            (() => onRerollPart('contextSevenDie'))
                          }>
                          <>
                            <strong>
                              {mapKindFromContextSevenDie(
                                roll.contextSevenDie
                              ) === 'localisation'
                                ? copy.character.contextSevenMapLocalisation
                                : copy.character.contextSevenMapBiome}
                            </strong>
                            {' · '}
                            {copy.character.raceDieLabel} :{' '}
                            <DiceFaces values={[roll.contextSevenDie]} />
                          </>
                        </MetaWithReroll>
                      )}
                    </div>
                  ) : null}
                  {roll.contextCard.rank === '10' ? (
                    <div className='character-summary__context-followup'>
                      <span className='character-summary__followup-label'>
                        {copy.character.contextSpokenNameLabel}
                      </span>
                      {roll.contextSpokenNameDice == null ? (
                        onRerollPart ? (
                          <Button
                            size='small'
                            type='default'
                            onClick={() =>
                              onRerollPart('contextSpokenNameDice')
                            }>
                            {copy.character.rollContextSpokenNameDice}
                          </Button>
                        ) : null
                      ) : (
                        <div className='character-summary__stack character-summary__stack--tight'>
                          <strong className='character-summary__spoken-name'>
                            {roll.contextSpokenName}
                          </strong>
                          <MetaWithReroll
                            rerollLabel={
                              copy.character.rerollContextSpokenNameDice
                            }
                            onReroll={
                              onRerollPart &&
                              (() => onRerollPart('contextSpokenNameDice'))
                            }>
                            <>
                              {copy.character.nameDiceLabel} :{' '}
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
      {characterFootnote}
    </>
  )
}
