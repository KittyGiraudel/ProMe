'use client'

import { RedoOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { Button, Typography } from 'antd'
import { encodeCharacterRoll } from '@/lib/lsdp/character/characterUrlCodec'
import {
  getAgeBand,
  getPersonality,
  type CharacterRoll,
} from '@/lib/lsdp/character/generate'
import { genderCompactSymbol } from '@/lib/lsdp/genderSymbols'
import { fr } from '@/messages/fr'

export type VillageOwnerEntry = { roll: CharacterRoll; ownerIndex: number }

export function VillageEstablishmentOwners({
  entries,
  onRerollOwner,
}: {
  entries: VillageOwnerEntry[] | undefined
  onRerollOwner?: (ownerIndex: number) => void
}) {
  if (!entries?.length) return null
  const multi = entries.length > 1

  const renderRow = (e: VillageOwnerEntry) => {
    const age = getAgeBand(e.roll)
    const personality = getPersonality(e.roll)
    const c = encodeURIComponent(encodeCharacterRoll(e.roll))
    return (
      <div className='village-summary__owner-row'>
        <span className='village-summary__owner-main'>
          <span className='village-summary__owner-line-start'>
            {genderCompactSymbol(e.roll.gender)}{' '}
            <Link
              href={`/generators/character?c=${c}`}
              className='village-summary__owner-name-link'
              aria-label={fr.village.openInCharacterBuilder}>
              {e.roll.name}
            </Link>
            {` (${fr.races[e.roll.race]})`}
          </span>
          <span className='village-summary__owner-sep'> — </span>
          <span className='village-summary__owner-age-personality'>
            {fr.ageBands[age]}, {fr.personalities[personality]}
          </span>
        </span>
        <span className='village-summary__owner-actions'>
          {onRerollOwner ? (
            <Button
              type='text'
              size='small'
              icon={<RedoOutlined />}
              aria-label={fr.village.rerollOwner}
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
        {multi ? fr.village.coOwnersLabel : fr.village.ownerLabel}
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
