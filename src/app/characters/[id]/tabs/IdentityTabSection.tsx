'use client'

import { Alert, Card, Space, Typography } from 'antd'
import { IdentityCard } from '@/components/CharacterSheet/IdentityCard'
import { CharacteristicsCard } from '@/components/CharacterSheet/CharacteristicsCard'
import { copy } from '@/messages/fr'
import { Button } from '@/components/Button/Button'
import { useCharacterContext } from '@/components/CharacterSheet/CharacterContext'
import { useMemo } from 'react'

export function IdentityTabSection() {
  const { getCharacterValue, onMarkAsDead } = useCharacterContext()
  const isDead = useMemo(
    () => getCharacterValue('lifeStatus') === 'dead',
    [getCharacterValue]
  )

  return (
    <Space orientation='vertical' size='middle' style={{ width: '100%' }}>
      <IdentityCard isArchetypeReadonly />
      <CharacteristicsCard />
      {!isDead ? (
        <Card
          title={copy.characters.dangerSectionTitle}
          style={{ border: '2px solid red' }}>
          <Space orientation='vertical' size='small' style={{ width: '100%' }}>
            <Typography.Text type='secondary'>
              {copy.characters.dangerSectionDescription}
            </Typography.Text>
            <Alert
              type='warning'
              showIcon
              description={
                <>
                  <strong>{copy.characters.markDeadAction}</strong> :{' '}
                  {copy.characters.dangerMarkDeadHelp}
                </>
              }
              action={
                <Button
                  danger
                  size='small'
                  htmlType='button'
                  type='link'
                  onClick={onMarkAsDead}>
                  {copy.common.apply}
                </Button>
              }
            />
          </Space>
        </Card>
      ) : null}
    </Space>
  )
}
