'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/Button/Button'
import type { PossibleBiomeId } from '@/lib/types'

const GatheringDialog = dynamic(
  () => import('@/components/GatheringList/GatheringDialog'),
  { ssr: false, loading: () => null }
)

export function GatheringButton({
  currentBiome,
}: {
  currentBiome: PossibleBiomeId
}) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button type='link' htmlType='button' onClick={() => setOpen(true)}>
        {t('characters.map.gathering_button')}
      </Button>
      <GatheringDialog
        open={open}
        onClose={() => setOpen(false)}
        currentBiome={currentBiome}
      />
    </>
  )
}
