import { Space, SpaceProps } from 'antd'

export function Spacing({
  children,
  orientation = 'vertical',
  size = 'middle',
  className,
  fullWidth = orientation === 'vertical',
  wrap,
}: {
  children: React.ReactNode
  orientation?: SpaceProps['orientation']
  size?: SpaceProps['size']
  className?: string
  fullWidth?: boolean
  wrap?: SpaceProps['wrap']
}) {
  return (
    <Space
      orientation={orientation}
      size={size}
      style={fullWidth ? { width: '100%' } : undefined}
      wrap={wrap}
      className={className}>
      {children}
    </Space>
  )
}
