import QuestionCircleOutlined from '@ant-design/icons/lib/icons/QuestionCircleOutlined'
import './CardCover.css'
import { type ElementType, type HTMLAttributes, type ReactNode } from 'react'

export function CardCover({
  url,
  title,
  titleAs: TitleAs = 'p',
  description,
  height,
  ...rest
}: Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  url: string
  title: ReactNode
  titleAs?: ElementType
  description?: ReactNode
  height?: string
}) {
  return (
    <div
      {...rest}
      tabIndex={0}
      className={['CardCover', rest.className].filter(Boolean).join(' ')}
      style={
        { '--height': height, '--image': `url(${url})` } as React.CSSProperties
      }>
      <div className='CardCover__overlay'></div>
      <div className='CardCover__content'>
        <TitleAs className='CardCover__title'>
          {description ? (
            <QuestionCircleOutlined className='CardCover__info' />
          ) : null}
          {title}
        </TitleAs>
        {description ? (
          <p className='CardCover__description'>{description}</p>
        ) : null}
      </div>
    </div>
  )
}
