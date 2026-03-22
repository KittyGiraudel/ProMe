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
} from '@/lib/lsdp/character/generate'
import { DiceFaces } from '@/components/DiceFaces/DiceFaces'
import { PlayingCardLabel } from '@/components/PlayingCardLabel/PlayingCardLabel'
import { RichText } from '@/components/RichText/RichText'
import { fr } from '@/messages/fr'
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
  if (!roll) {
    return (
      <Card
        className='character-summary character-summary--empty'
        variant='borderless'>
        <Typography.Text type='secondary'>
          {fr.character.emptySummaryBefore}
          {fr.character.rollAll}
          {fr.character.emptySummaryAfter}
        </Typography.Text>
      </Card>
    )
  }

  const age = getAgeBand(roll)
  const personality = getPersonality(roll)

  return (
    <Card className='character-summary' variant='borderless'>
      <Descriptions
        column={1}
        size='middle'
        styles={{ label: { fontWeight: 600, width: '11rem' } }}
        className='character-summary__descriptions'
        items={[
          {
            key: 'name',
            label: fr.character.sectionName,
            children: (
              <div className='character-summary__stack'>
                <strong className='character-summary__name'>{roll.name}</strong>
                <MetaWithReroll
                  rerollLabel={fr.character.rerollName}
                  onReroll={onRerollPart && (() => onRerollPart('nameDice'))}>
                  <>
                    {fr.character.nameDiceLabel} :{' '}
                    <DiceFaces values={roll.nameDice} />
                  </>
                </MetaWithReroll>
              </div>
            ),
          },
          {
            key: 'race',
            label: fr.character.sectionRace,
            children: (
              <div className='character-summary__stack'>
                <span>{fr.races[roll.race]}</span>
                <MetaWithReroll
                  rerollLabel={fr.character.rerollRace}
                  onReroll={onRerollPart && (() => onRerollPart('race'))}>
                  <>
                    {fr.character.raceDieLabel} :{' '}
                    <DiceFaces values={[roll.raceDie]} />
                  </>
                </MetaWithReroll>
              </div>
            ),
          },
          {
            key: 'gender',
            label: fr.character.sectionGender,
            children: (
              <div className='character-summary__stack'>
                <span>{fr.genders[roll.gender]}</span>
                <MetaWithReroll
                  rerollLabel={fr.character.rerollGender}
                  onReroll={onRerollPart && (() => onRerollPart('gender'))}>
                  <>
                    {fr.character.raceDieLabel} :{' '}
                    <DiceFaces values={[roll.genderDie]} />
                  </>
                </MetaWithReroll>
              </div>
            ),
          },
          {
            key: 'agePersonality',
            label: fr.character.sectionAgePersonality,
            children: (
              <div className='character-summary__stack'>
                <span>
                  {fr.ageBands[age]}, {fr.personalities[personality]}
                </span>
                <MetaWithReroll
                  rerollLabel={fr.character.rerollAgePersonalityCard}
                  onReroll={
                    onRerollPart && (() => onRerollPart('agePersonalityCard'))
                  }>
                  <>
                    {fr.character.cardLabel} :{' '}
                    <PlayingCardLabel card={roll.agePersonalityCard} />
                  </>
                </MetaWithReroll>
              </div>
            ),
          },
          {
            key: 'context',
            label: fr.character.sectionContext,
            children: (
              <div className='character-summary__stack'>
                <RichText
                  as='p'
                  text={roll.contextText}
                  className='character-summary__context'
                />
                <MetaWithReroll
                  rerollLabel={fr.character.rerollContextCard}
                  onReroll={
                    onRerollPart && (() => onRerollPart('contextCard'))
                  }>
                  <>
                    {fr.character.cardLabel} :{' '}
                    <PlayingCardLabel card={roll.contextCard} /> —{' '}
                    {fr.character.contextCardNote}
                  </>
                </MetaWithReroll>
                {roll.contextCard.rank === '7' ? (
                  <div className='character-summary__context-followup'>
                    <span className='character-summary__followup-label'>
                      {fr.character.contextSevenFollowupLabel}
                    </span>
                    {roll.contextSevenDie == null ? (
                      onRerollPart ? (
                        <Button
                          size='small'
                          type='default'
                          onClick={() => onRerollPart('contextSevenDie')}>
                          {fr.character.rollContextSevenDie}
                        </Button>
                      ) : null
                    ) : (
                      <MetaWithReroll
                        rerollLabel={fr.character.rerollContextSevenDie}
                        onReroll={
                          onRerollPart &&
                          (() => onRerollPart('contextSevenDie'))
                        }>
                        <>
                          <strong>
                            {mapKindFromContextSevenDie(
                              roll.contextSevenDie
                            ) === 'localisation'
                              ? fr.character.contextSevenMapLocalisation
                              : fr.character.contextSevenMapBiome}
                          </strong>
                          {' · '}
                          {fr.character.raceDieLabel} :{' '}
                          <DiceFaces values={[roll.contextSevenDie]} />
                        </>
                      </MetaWithReroll>
                    )}
                  </div>
                ) : null}
                {roll.contextCard.rank === '10' ? (
                  <div className='character-summary__context-followup'>
                    <span className='character-summary__followup-label'>
                      {fr.character.contextSpokenNameLabel}
                    </span>
                    {roll.contextSpokenNameDice == null ? (
                      onRerollPart ? (
                        <Button
                          size='small'
                          type='default'
                          onClick={() => onRerollPart('contextSpokenNameDice')}>
                          {fr.character.rollContextSpokenNameDice}
                        </Button>
                      ) : null
                    ) : (
                      <div className='character-summary__stack character-summary__stack--tight'>
                        <strong className='character-summary__spoken-name'>
                          {roll.contextSpokenName}
                        </strong>
                        <MetaWithReroll
                          rerollLabel={fr.character.rerollContextSpokenNameDice}
                          onReroll={
                            onRerollPart &&
                            (() => onRerollPart('contextSpokenNameDice'))
                          }>
                          <>
                            {fr.character.nameDiceLabel} :{' '}
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
  )
}
