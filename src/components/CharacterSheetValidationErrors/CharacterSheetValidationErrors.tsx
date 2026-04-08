import { Alert } from 'antd'
import { useTranslations } from 'next-intl'
import { ValidationError } from '@/lib/character/store/localStorageStore'

export function CharacterSheetValidationErrors({
  errors,
}: {
  errors?: ValidationError[]
}) {
  const t = useTranslations()

  if (!errors || errors.length === 0) return null

  return (
    <Alert
      showIcon
      type='warning'
      description={errors.map(error => t(error.key, error.params)).join('\n')}
    />
  )
}
