import InfoCircleFilled from '@ant-design/icons/lib/icons/InfoCircleFilled'
import { NotificationInstance } from 'antd/es/notification/interface'
import type { _Translator } from 'next-intl'
import type { RandomBiomeResult } from '@/lib/random/randomBiome'

export function showRandomBiomeDiscoveredNotification({
  notification,
  t,
  rolled,
}: {
  notification: NotificationInstance
  t: _Translator
  rolled: RandomBiomeResult
}) {
  const biomeName = t(`common.biomes.${rolled.biome}`)

  notification.open({
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
    duration: 10,
    placement: 'bottomRight',
  })
}
