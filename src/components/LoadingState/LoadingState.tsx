import { Empty, Spin } from 'antd'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { useTranslations } from 'next-intl'

export function LoadingState({
  description,
  size = 'large',
}: {
  description?: string
  size?: SizeType
}) {
  const t = useTranslations()

  return (
    <Empty
      image={<Spin size={size} />}
      description={description ?? t('common.loading')}
    />
  )
}
