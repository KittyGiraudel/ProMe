'use client'

import { RedoOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/Button/Button'
import { JournalReferencePreview } from '@/components/JournalReferencePreview/JournalReferencePreview'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import {
  getAgeBand,
  getPersonality,
  type InhabitantRoll,
} from '@/lib/inhabitant/generate'
import { encodeInhabitantRoll } from '@/lib/inhabitant/inhabitantUrlCodec'

export type VillageOwnerEntry = { roll: InhabitantRoll; ownerIndex: number }

export function VillageEstablishmentOwners({
  entries,
  onRerollOwner,
}: {
  entries: VillageOwnerEntry[] | undefined
  onRerollOwner?: (ownerIndex: number) => void
}) {
  const t = useTranslations()
  if (!entries?.length) return null
  const multi = entries.length > 1

  const renderRow = (e: VillageOwnerEntry) => {
    const age = getAgeBand(e.roll)
    const personality = getPersonality(e.roll)
    const inhabitantHref = `/generators/npc/${encodeInhabitantRoll(e.roll)}`
    const gender = e.roll.gender

    return (
      <div className='VillageSummary__owner-row'>
        <span className='VillageSummary__owner-main'>
          {t.rich('inhabitant.one_liner_rich', {
            gender: genderCompactSymbol(gender),
            name: () => (
              <JournalReferencePreview
                key='link'
                kind='npc'
                referenceId={encodeInhabitantRoll(e.roll)}
                href={inhabitantHref}
                className='VillageSummary__owner-name-link'
                label={e.roll.name}
              />
            ),
            faction: t(`common.factions.${e.roll.faction}`),
            age: t(`common.ages.${age}`),
            personality: t(`common.personalities.${personality}`, {
              gender,
            }),
          })}
        </span>
        <span className='VillageSummary__owner-actions'>
          {onRerollOwner ? (
            <Button
              type='text'
              size='small'
              icon={<RedoOutlined />}
              aria-label={t('village.reroll_owner')}
              onClick={() => onRerollOwner(e.ownerIndex)}
              className='VillageSummary__owner-reroll'
            />
          ) : null}
        </span>
      </div>
    )
  }

  return (
    <div className='VillageSummary__owners'>
      <Typography.Text
        type='secondary'
        className='VillageSummary__owners-heading'>
        {t(multi ? 'village.co_owners_label' : 'village.owner_label')}
      </Typography.Text>
      {multi ? (
        <ul className='VillageSummary__owners-list'>
          {entries.map(e => (
            <li key={e.ownerIndex} className='VillageSummary__owners-item'>
              {renderRow(e)}
            </li>
          ))}
        </ul>
      ) : (
        <div className='VillageSummary__owners-one'>
          {renderRow(entries[0]!)}
        </div>
      )}
    </div>
  )
}
