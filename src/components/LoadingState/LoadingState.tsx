import { Empty, Result, Spin } from 'antd'
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
    <Result
      status='info'
      title={description ?? t('common.loading')}
      extra={<Spin size={size} />}
    />
  )
}
