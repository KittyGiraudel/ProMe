'use client'

import { RedoOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { Button, Typography } from 'antd'
import { encodeCharacterRoll } from '@/lib/character/characterUrlCodec'
import {
  getAgeBand,
  getPersonality,
  type CharacterRoll,
} from '@/lib/character/generate'
import { genderCompactSymbol } from '@/lib/character/genderSymbols'
import { copy } from '@/messages/fr'

export type VillageOwnerEntry = { roll: CharacterRoll; ownerIndex: number }

export function VillageEstablishmentOwners({
  entries,
  characterPageVillageQuery,
  onRerollOwner,
}: {
  entries: VillageOwnerEntry[] | undefined
  characterPageVillageQuery?: string | null
  onRerollOwner?: (ownerIndex: number) => void
}) {
  if (!entries?.length) return null
  const multi = entries.length > 1

  const renderRow = (e: VillageOwnerEntry) => {
    const age = getAgeBand(e.roll)
    const personality = getPersonality(e.roll)
    const c = encodeURIComponent(encodeCharacterRoll(e.roll))
    const characterHref =
      characterPageVillageQuery != null && characterPageVillageQuery !== ''
        ? `/generators/character?c=${c}&${characterPageVillageQuery}`
        : `/generators/character?c=${c}`
    return (
      <div className='village-summary__owner-row'>
        <span className='village-summary__owner-main'>
          <span className='village-summary__owner-line-start'>
            {genderCompactSymbol(e.roll.gender)}{' '}
            <Link
              href={characterHref}
              className='village-summary__owner-name-link'
              aria-label={copy.village.openInCharacterBuilder}>
              {e.roll.name}
            </Link>
            {` (${copy.races[e.roll.race]})`}
          </span>
          <span className='village-summary__owner-sep'>
            {copy.common.emDashSpaced}
          </span>
          <span className='village-summary__owner-age-personality'>
            {copy.ageBands[age]}, {copy.personalities[personality]}
          </span>
        </span>
        <span className='village-summary__owner-actions'>
          {onRerollOwner ? (
            <Button
              type='text'
              size='small'
              icon={<RedoOutlined />}
              aria-label={copy.village.rerollOwner}
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
        {multi ? copy.village.coOwnersLabel : copy.village.ownerLabel}
        {' :'}
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
