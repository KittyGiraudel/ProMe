import { describe, expect, it } from 'vitest'
import { testLocalize } from '@/lib/localization/testLocalize'
import type { Faction } from '@/lib/types'
import { generateVillageRoll } from './generate'
import { generateOwnersForVillage } from './ownersGenerate'
import {
  decodeVillageIdParam,
  decodeVillageIdRollParam,
  encodeVillageId,
} from './villageIdCodec'
import { encodeVillageOwners, encodeVillageRoll } from './villageUrlCodec'

function seededRng(seed: number): () => number {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

describe('villageIdCodec', () => {
  it('round-trips full (roll + owners) village id', () => {
    const rng = seededRng(123)
    const roll = generateVillageRoll(rng)
    const faction: Faction = 'bruja'
    const owners = generateOwnersForVillage(roll, faction, testLocalize, rng)

    const id = encodeVillageId(roll, owners)
    const decoded = decodeVillageIdParam(id, testLocalize)

    expect(decoded).not.toBeNull()
    expect(decoded!.roll).toEqual(roll)
    expect(decoded!.owners).toEqual(owners)
  })

  it('decodes only the roll part when owners segment is invalid', () => {
    const rng = seededRng(42)
    const roll = generateVillageRoll(rng)

    const id = `${encodeVillageRoll(roll)}.INVALID_OWNERS`
    expect(decodeVillageIdRollParam(id)).toEqual(roll)
  })

  it('rejects mismatched owner counts', () => {
    const rng = seededRng(7)
    const roll = generateVillageRoll(rng)
    const faction: Faction = 'bruja'

    const owners = generateOwnersForVillage(roll, faction, testLocalize, rng)
    const wrongOwnersEnc = encodeVillageOwners(
      owners.slice(0, Math.max(0, owners.length - 1))
    )
    const id = `${encodeVillageRoll(roll)}.${wrongOwnersEnc}`

    expect(decodeVillageIdParam(id, testLocalize)).toBeNull()
  })

  it('decodes shared village id from URL example', () => {
    const id =
      'H2D2C4H7D7.1D4C3H9121-1S5H3H71414-1C6DQC2521-1C4H2SJ645-1D5S5DJ361'

    const decoded = decodeVillageIdParam(id, testLocalize)
    expect(decoded).not.toBeNull()
  })
})
