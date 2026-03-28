import { QuestionCircleOutlined } from '@ant-design/icons'
import { Button, ButtonProps } from 'antd'

export function HelpButton({
  label,
  ...props
}: ButtonProps & { label: string }) {
  return (
    <Button
      {...props}
      type='text'
      size='small'
      htmlType='button'
      icon={<QuestionCircleOutlined />}
      aria-label={label}
      disabled={false}
    />
  )
}
