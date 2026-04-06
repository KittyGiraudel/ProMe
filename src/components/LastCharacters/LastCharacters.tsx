'use client'

import { Card, Col, Row, Typography } from 'antd'
import { useFormatter, useTranslations } from 'next-intl'
import { useCharacterLink } from '@/hooks/useCharacterLink'
import { useCharacters } from '@/hooks/useCharacters'
import { useHydration } from '@/hooks/useHydration'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import { BlockedLink } from '../Navigation/BlockedLink'

export function LastCharacters() {
  const t = useTranslations()
  const format = useFormatter()
  const recentCharacters = useCharacters(3)
  const getCharacterLink = useCharacterLink({ tabId: 'identity' })
  const hydrated = useHydration()

  if (!hydrated) return null

  return (
    <Row gutter={[16, 16]}>
      {recentCharacters.map(character => (
        <Col xs={24} md={8} key={character.id}>
          <BlockedLink
            key={character.id}
            href={getCharacterLink({ characterId: character.id })}>
            <Card
              size='small'
              hoverable
              title={
                <>
                  {character.gender
                    ? genderCompactSymbol(character.gender)
                    : ''}{' '}
                  {character.name || t('characters_list.unnamed')},{' '}
                  {t(`common.archetypes.name.${character.archetype}`, {
                    gender: character.gender ?? 'indeterminate',
                  })}
                </>
              }>
              <Typography.Text type='secondary'>
                {t('home.updated_line', {
                  value: format.dateTime(new Date(character.updatedAt), {
                    dateStyle: 'medium',
                  }),
                })}
              </Typography.Text>
            </Card>
          </BlockedLink>
        </Col>
      ))}
    </Row>
  )
}
