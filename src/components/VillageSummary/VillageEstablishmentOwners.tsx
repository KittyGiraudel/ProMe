'use client'

import RedoOutlined from '@ant-design/icons/lib/icons/RedoOutlined'
import { Button, Tooltip, Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { JournalReferencePreview } from '@/components/JournalReferencePreview/JournalReferencePreview'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import {
  getAgeBand,
  getPersonality,
  type InhabitantRoll,
} from '@/lib/inhabitant/generate'
import { encodeInhabitantRoll } from '@/lib/inhabitant/inhabitantUrlCodec'

export type OwnerEntry = { roll: InhabitantRoll; ownerIndex: number }

export function VillageEstablishmentOwners({
  entries,
  onRerollOwner,
}: {
  entries: OwnerEntry[] | undefined
  onRerollOwner?: (ownerIndex: number) => void
}) {
  const t = useTranslations()
  if (!entries?.length) return null
  const multi = entries.length > 1

  const renderRow = (e: OwnerEntry) => {
    const age = getAgeBand(e.roll)
    const personality = getPersonality(e.roll)
    const gender = e.roll.gender

    return (
      <>
        {t.rich('inhabitant.one_liner_rich', {
          gender: genderCompactSymbol(gender),
          name: () => (
            <JournalReferencePreview
              key='link'
              kind='npc'
              referenceId={encodeInhabitantRoll(e.roll)}
              href={{
                route: 'npc',
                params: { id: encodeInhabitantRoll(e.roll) },
              }}
              label={e.roll.name}
            />
          ),
          faction: t(`common.factions.${e.roll.faction}`),
          age: t(`common.ages.${age}`).toLowerCase(),
          personality: t(`common.personalities.${personality}`, {
            gender,
          }).toLowerCase(),
        })}{' '}
        <Tooltip title={t('village.reroll_owner')} trigger={['hover', 'focus']}>
          <Button
            type='text'
            size='small'
            icon={<RedoOutlined />}
            disabled={!onRerollOwner}
            aria-label={t('village.reroll_owner')}
            onClick={() => onRerollOwner?.(e.ownerIndex)}
          />
        </Tooltip>
      </>
    )
  }

  const first = entries[0]
  const second = entries[1]

  return (
    <p>
      <Typography.Text type='secondary'>
        {t(multi ? 'village.co_owners_label' : 'village.owner_label')}
      </Typography.Text>{' '}
      {renderRow(first)}
      {second ? (
        <>
          {' '}
          <strong>{t('common.conjunction')}</strong> {renderRow(second)}
        </>
      ) : (
        ''
      )}
    </p>
  )
}
