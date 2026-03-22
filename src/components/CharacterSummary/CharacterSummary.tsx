'use client'

import { RedoOutlined } from '@ant-design/icons'
import type { ReactNode } from 'react'
import { Button, Card, Descriptions, Tooltip, Typography } from 'antd'
import {
  type CharacterRerollPart,
  type CharacterRoll,
  getAgeBand,
  getPersonality,
  mapKindFromContextSevenDie,
} from '@/lib/character/generate'
import { DiceFaces } from '@/components/DiceFaces/DiceFaces'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import { RichText } from '@/components/RichText/RichText'
import { copy } from '@/messages/fr'
import './CharacterSummary.css'

type CharacterSummaryProps = {
  roll: CharacterRoll | null
  onRerollPart?: (part: CharacterRerollPart) => void
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
}: CharacterSummaryProps) {
  const characterFootnote = (
    <Typography.Text type='secondary' className='generator-rulebook-footnote'>
      {copy.rulebook.characterFootnote}
    </Typography.Text>
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
                <div className='character-summary__stack'>
                  <strong className='character-summary__name'>
                    {roll.name}
                  </strong>
                  <MetaWithReroll
                    rerollLabel={copy.character.rerollName}
                    onReroll={onRerollPart && (() => onRerollPart('nameDice'))}>
                    <>
                      {copy.character.nameDiceLabel} :{' '}
                      <DiceFaces values={roll.nameDice} />
                    </>
                  </MetaWithReroll>
                </div>
              ),
            },
            {
              key: 'race',
              label: copy.character.sectionRace,
              children: (
                <div className='character-summary__stack'>
                  <span>{copy.races[roll.race]}</span>
                  <MetaWithReroll
                    rerollLabel={copy.character.rerollRace}
                    onReroll={onRerollPart && (() => onRerollPart('race'))}>
                    <>
                      {copy.character.raceDieLabel} :{' '}
                      <DiceFaces values={[roll.raceDie]} />
                    </>
                  </MetaWithReroll>
                </div>
              ),
            },
            {
              key: 'gender',
              label: copy.character.sectionGender,
              children: (
                <div className='character-summary__stack'>
                  <span>{copy.genders[roll.gender]}</span>
                  <MetaWithReroll
                    rerollLabel={copy.character.rerollGender}
                    onReroll={onRerollPart && (() => onRerollPart('gender'))}>
                    <>
                      {copy.character.raceDieLabel} :{' '}
                      <DiceFaces values={[roll.genderDie]} />
                    </>
                  </MetaWithReroll>
                </div>
              ),
            },
            {
              key: 'agePersonality',
              label: copy.character.sectionAgePersonality,
              children: (
                <div className='character-summary__stack'>
                  <span>
                    {copy.ageBands[age]}, {copy.personalities[personality]}
                  </span>
                  <MetaWithReroll
                    rerollLabel={copy.character.rerollAgePersonalityCard}
                    onReroll={
                      onRerollPart && (() => onRerollPart('agePersonalityCard'))
                    }>
                    <>
                      {copy.character.cardLabel} :{' '}
                      <PlayingCardLabel card={roll.agePersonalityCard} />
                    </>
                  </MetaWithReroll>
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
