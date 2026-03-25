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
import { useLocalize } from '@/app/contexts/LocalizationContext'

export type VillageOwnerEntry = { roll: InhabitantRoll; ownerIndex: number }

export function VillageEstablishmentOwners({
  entries,
  inhabitantPageVillageQuery,
  onRerollOwner,
}: {
  entries: VillageOwnerEntry[] | undefined
  inhabitantPageVillageQuery?: string | null
  onRerollOwner?: (ownerIndex: number) => void
}) {
  const localize = useLocalize()
  if (!entries?.length) return null
  const multi = entries.length > 1

  const renderRow = (e: VillageOwnerEntry) => {
    const age = getAgeBand(e.roll)
    const personality = getPersonality(e.roll)
    const params = new URLSearchParams(inhabitantPageVillageQuery ?? '')
    params.set('i', encodeInhabitantRoll(e.roll))
    const inhabitantHref = `/generators/inhabitant?${params.toString()}`
    return (
      <div className='village-summary__owner-row'>
        <span className='village-summary__owner-main'>
          {localize.template('inhabitant.oneLiner', {
            gender: genderCompactSymbol(e.roll.gender),
            name: (
              <BlockedLink
                href={inhabitantHref}
                className='village-summary__owner-name-link'>
                {e.roll.name}
              </BlockedLink>
            ),
            faction: localize.string(`factions.${e.roll.faction}`),
            age: localize.string(`ageBands.${age}`),
            personality: localize.string(`personalities.${personality}`),
          })}
        </span>
        <span className='village-summary__owner-actions'>
          {onRerollOwner ? (
            <Button
              type='text'
              size='small'
              icon={<RedoOutlined />}
              aria-label={localize.string('village.rerollOwner')}
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
        {localize.string(
          multi ? 'village.coOwnersLabel' : 'village.ownerLabel'
        )}
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
