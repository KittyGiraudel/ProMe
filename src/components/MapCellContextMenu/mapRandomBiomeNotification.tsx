import InfoCircleFilled from '@ant-design/icons/lib/icons/InfoCircleFilled'
import type { _Translator } from 'next-intl'
import type { ReactNode } from 'react'
import type { RandomBiomeResult } from '@/lib/random/randomBiome'

type NotificationInfo = (args: {
  icon: ReactNode
  title: ReactNode
  description: ReactNode
  placement?: 'bottomRight'
}) => void

export function showRandomBiomeDiscoveredNotification({
  notification,
  t,
  rolled,
}: {
  notification: { info: NotificationInfo }
  t: _Translator
  rolled: RandomBiomeResult
}) {
  const biomeName = t(`common.biomes.${rolled.biome}`)

  notification.info({
    icon: (
      <span className='Map__NotificationIcon' data-biome={rolled.biome}>
        <InfoCircleFilled />
      </span>
    ),
    title: t('characters.map.random_biome_discovered_title'),
    description: t('characters.map.random_biome_discovered_description', {
      biomeName,
      additionalTilesToMark: rolled.additionalTilesToMark,
    }),
    placement: 'bottomRight',
  })
}
