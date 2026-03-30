import { encodePlayingCard } from '@/lib/codec/cards'
import { InhabitantRoll } from '@/lib/inhabitant/generate'
import { VillageEstablishmentRow } from '@/lib/village/resolveVillageDisplay'
import { VillageEstablishmentLine } from './VillageEstablishmentLine'
import { type OwnerEntry } from './VillageEstablishmentOwners'

export function UngroupedEstablishmentsList({
  establishments,
  ownerSlotByEstIndex,
  owners,
  ownersOk,
  onRerollPrimarySlot,
  onRerollOwner,
}: {
  establishments: readonly VillageEstablishmentRow[]
  ownerSlotByEstIndex: readonly (number | null)[]
  owners: InhabitantRoll[] | null
  ownersOk: boolean
  onRerollPrimarySlot?: (slotIndex: number) => void
  onRerollOwner?: (ownerIndex: number) => void
}) {
  return (
    <ol className='VillageSummary__list'>
      {establishments.map((row, i) => {
        const ownerSlot = ownerSlotByEstIndex[i] ?? null
        const ownerEntries: OwnerEntry[] | undefined =
          ownersOk && ownerSlot !== null && owners
            ? [{ roll: owners[ownerSlot]!, ownerIndex: ownerSlot }]
            : undefined

        return (
          <VillageEstablishmentLine
            key={`${encodePlayingCard(row.card)}-${i}`}
            title={row.text}
            card={row.card}
            rerollPrimarySlot={row.rerollPrimarySlot ?? null}
            onRerollPrimarySlot={onRerollPrimarySlot}
            ownerEntries={ownerEntries}
            onRerollOwner={onRerollOwner}
          />
        )
      })}
    </ol>
  )
}
