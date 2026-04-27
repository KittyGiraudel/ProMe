import QuestionCircleOutlined from '@ant-design/icons/lib/icons/QuestionCircleOutlined'
import { Button, type ButtonProps, Tooltip } from 'antd'

export function HelpButton({
  label,
  tooltip,
  ...props
}: ButtonProps & { label: string; tooltip?: string }) {
  if (tooltip) {
    return (
      <Tooltip title={tooltip} trigger={['hover', 'focus']}>
        <Button
          {...props}
          type='text'
          size='small'
          icon={<QuestionCircleOutlined />}
          aria-label={label}
          disabled={false}
        />
      </Tooltip>
    )
  }

  return (
    <Button
      {...props}
      type='text'
      icon={<QuestionCircleOutlined />}
      aria-label={label}
      disabled={false}
    />
  )
}
