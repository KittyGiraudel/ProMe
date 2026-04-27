'use client'

import { Button } from 'antd'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import type { PossibleBiomeId } from '@/lib/types'

const EncountersDialog = dynamic(
  () => import('@/components/EncountersList/EncountersDialog'),
  { ssr: false, loading: () => null }
)

export function EncountersButton({
  currentBiome,
}: {
  currentBiome: PossibleBiomeId
}) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button type='link' onClick={() => setOpen(true)}>
        {t('characters.map.encounters_button')}
      </Button>
      <EncountersDialog
        open={open}
        onClose={() => setOpen(false)}
        currentBiome={currentBiome}
      />
    </>
  )
}
