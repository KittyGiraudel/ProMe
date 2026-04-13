import { establishmentDetailRulebookPage } from '@/constants/rulebookPages'
import { InhabitantRoll } from '@/lib/inhabitant/generate'
import { groupEstablishments } from '@/lib/village/groupEstablishments'
import { VillageEstablishmentRow } from '@/lib/village/resolveVillageDisplay'
import { VillageEstablishmentLine } from './VillageEstablishmentLine'
import { type OwnerEntry } from './VillageEstablishmentOwners'

export function GroupedEstablishmentsList({
  groupedEstablishments,
  establishments,
  ownerSlotByEstIndex,
  owners,
  ownersOk,
  onRerollPrimarySlot,
  onRerollOwner,
}: {
  groupedEstablishments: ReturnType<typeof groupEstablishments>
  establishments: readonly VillageEstablishmentRow[]
  ownerSlotByEstIndex: readonly (number | null)[]
  owners: InhabitantRoll[] | null
  ownersOk: boolean
  onRerollPrimarySlot?: (slotIndex: number) => void
  onRerollOwner?: (ownerIndex: number) => void
}) {
  return (
    <ol className='VillageSummary__list'>
      {groupedEstablishments.map(group => {
        const rulebookPages = Array.from(
          new Set(
            group.ownerIndices.map(ownerIndex =>
              establishmentDetailRulebookPage(
                establishments[ownerIndex]!.card.rank
              )
            )
          )
        ).sort((a, b) => a - b)

        const ownerEntries: OwnerEntry[] | undefined =
          ownersOk && owners
            ? group.ownerIndices.flatMap(ownerIndex => {
                const ownerSlot = ownerSlotByEstIndex[ownerIndex] ?? null
                if (ownerSlot === null) return []
                return [{ roll: owners[ownerSlot]!, ownerIndex }]
              })
            : undefined

        return (
          <VillageEstablishmentLine
            key={group.key}
            title={group.text}
            card={group.card}
            rulebookPages={rulebookPages}
            rerollPrimarySlot={group.rerollPrimarySlot}
            onRerollPrimarySlot={onRerollPrimarySlot}
            ownerEntries={ownerEntries}
            onRerollOwner={onRerollOwner}
          />
        )
      })}
    </ol>
  )
}
