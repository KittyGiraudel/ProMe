'use client'

import { RedoOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import { encodeInhabitantRoll } from '@/lib/inhabitant/inhabitantUrlCodec'
import {
  getAgeBand,
  getPersonality,
  type InhabitantRoll,
} from '@/lib/inhabitant/generate'
import { genderCompactSymbol } from '@/lib/inhabitant/genderSymbols'
import { BlockedLink } from '@/components/Navigation/BlockedLink'
import { Button } from '@/components/Button/Button'
import { useTranslations } from 'next-intl'

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
    return (
      <div className='village-summary__owner-row'>
        <span className='village-summary__owner-main'>
          {t.rich('inhabitant.one_liner_rich', {
            gender: genderCompactSymbol(e.roll.gender),
            name: () => (
              <BlockedLink
                key='link'
                href={inhabitantHref}
                className='village-summary__owner-name-link'>
                {e.roll.name}
              </BlockedLink>
            ),
            faction: t(`common.factions.${e.roll.faction}`),
            age: t(`common.age_bands.${age}`),
            personality: t(`common.personalities.${personality}`),
          })}
        </span>
        <span className='village-summary__owner-actions'>
          {onRerollOwner ? (
            <Button
              type='text'
              size='small'
              icon={<RedoOutlined />}
              aria-label={t('village.reroll_owner')}
              onClick={() => onRerollOwner(e.ownerIndex)}
              className='village-summary__owner-reroll'
            />
          ) : null}
        </span>
      </div>
    )
  }

  return (
    <div className='village-summary__owners'>
      <Typography.Text
        type='secondary'
        className='village-summary__owners-heading'>
        {t(multi ? 'village.co_owners_label' : 'village.owner_label')}
      </Typography.Text>
      {multi ? (
        <ul className='village-summary__owners-list'>
          {entries.map(e => (
            <li key={e.ownerIndex} className='village-summary__owners-item'>
              {renderRow(e)}
            </li>
          ))}
        </ul>
      ) : (
        <div className='village-summary__owners-one'>
          {renderRow(entries[0]!)}
        </div>
      )}
    </div>
  )
}
