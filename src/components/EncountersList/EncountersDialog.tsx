import { Modal, Tabs } from 'antd'
import { useTranslations } from 'next-intl'
import { BIOME_IDS } from '@/lib/constants/misc'
import type { BiomeId } from '@/lib/types'
import { BiomeBubble } from '../BiomeBubble/BiomeBubble'
import { EncountersList } from './EncountersList'

type Props = {
  open: boolean
  onClose: () => void
  currentBiome: BiomeId | 'unexplored'
}

export function EncountersDialog({ open, onClose, currentBiome }: Props) {
  const t = useTranslations()
  const defaultActiveKey =
    currentBiome === 'unexplored' ? BIOME_IDS[0] : currentBiome

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={t('characters.map.encounters_dialog_title')}
      footer={null}
      width='min(900px, 96vw)'
      destroyOnHidden>
      <Tabs
        defaultActiveKey={defaultActiveKey}
        items={BIOME_IDS.map(biome => ({
          key: biome,
          label: (
            <>
              <BiomeBubble biome={biome} /> {t(`common.biomes.${biome}`)}
            </>
          ),
          children: <EncountersList biome={biome} />,
        }))}
      />
    </Modal>
  )
}
