import type { _Translator } from 'next-intl'
import type { InhabitantRoll } from '@/lib/inhabitant/generate'
import type { VillageRoll } from '@/lib/village/generate'
import { countVillageOwnerSlots } from '@/lib/village/ownersGenerate'
import {
  decodeVillageOwnersParam,
  decodeVillageRollParam,
  encodeVillageOwners,
  encodeVillageRoll,
} from '@/lib/village/villageUrlCodec'

/**
 * Separator between the village roll segment and the owners segment inside the `[id]`
 * route parameter used by the village generator.
 *
 * Route shape:
 * - `/generators/village/[id]?f=<faction>`
 *
 * Encoding shape:
 * - `[id] = <villageRoll>.<ownersBlob>`
 *   - `<villageRoll>` is `encodeVillageRoll(roll)` (cards-only, no `?v=` query param)
 *   - `<ownersBlob>` is `encodeVillageOwners(owners)` (joined inhabitant blobs)
 *
 * We keep `f` as a query parameter because it is driven by a UI select and can be
 * changed independently of the deterministic roll/owners payload.
 */
const ID_SEP = '.'

/**
 * Encode a full village share id for the route segment `[id]`.
 *
 * This is intended to be the canonical serialization used by navigation, copy/share
 * flows, and server-side decoding.
 */
export function encodeVillageId(
  roll: VillageRoll,
  owners: InhabitantRoll[]
): string {
  return `${encodeVillageRoll(roll)}${ID_SEP}${encodeVillageOwners(owners)}`
}

/**
 * Decode only the village roll part (left side of the first `.`).
 *
 * This is used by markdown link summaries/tests and other “preview” contexts where
 * we only need the establishment count / trait labels and do not need owners.
 */
export function decodeVillageIdRollParam(idRaw: string): VillageRoll | null {
  const id = idRaw.trim()
  if (!id) return null

  const firstDot = id.indexOf(ID_SEP)
  if (firstDot < 0) return null

  const rollEnc = id.slice(0, firstDot)
  return decodeVillageRollParam(rollEnc)
}

/**
 * Decode the full `[id]` route segment into `{ roll, owners }`.
 *
 * Validation rules:
 * - roll segment must decode via `decodeVillageRollParam`
 * - owners segment must decode via `decodeVillageOwnersParam`
 * - owners length must match the number of owner slots implied by the roll
 *
 * Returns `null` for any invalid input (callers typically treat this as 404).
 */
export function decodeVillageIdParam(
  idRaw: string,
  t: _Translator
): { roll: VillageRoll; owners: InhabitantRoll[] } | null {
  const id = idRaw.trim()
  if (!id) return null

  const parts = id.split(ID_SEP)
  if (parts.length < 2) return null
  const rollEnc = parts[0]!
  const ownersEnc = parts.slice(1).join(ID_SEP)

  const roll = decodeVillageRollParam(rollEnc)
  if (!roll) return null

  const owners = decodeVillageOwnersParam(t, ownersEnc)
  if (!owners) return null

  const expectedOwners = countVillageOwnerSlots(roll, t)
  if (owners.length !== expectedOwners) return null

  return { roll, owners }
}
