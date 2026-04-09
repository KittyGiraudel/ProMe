import './CardCover.css'
import { type ElementType, type HTMLAttributes, type ReactNode } from 'react'

export function CardCover({
  url,
  title,
  titleAs: TitleAs = 'p',
  description,
  ...rest
}: Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  url: string
  title: ReactNode
  titleAs?: ElementType
  description?: ReactNode
}) {
  return (
    <div
      {...rest}
      tabIndex={0}
      className='CardCover'
      style={{ '--image': `url(${url})` } as React.CSSProperties}>
      <div className='CardCover__overlay'></div>
      <div className='CardCover__content'>
        <TitleAs className='CardCover__title'>{title}</TitleAs>
        {description ? (
          <p className='CardCover__description'>{description}</p>
        ) : null}
      </div>
    </div>
  )
}
