import './BiomeSection.css'

type Props = {
  title: string
  children: React.ReactNode
  className?: string
  id?: string
}

export function BiomeSection({ title, children, className, id }: Props) {
  return (
    <section className={`BiomeSection ${className ?? ''}`} id={id}>
      <div className='BiomeSection__head'>
        <h2 className='BiomeSection__title'>{title}</h2>
        <div className='BiomeSection__rule' />
      </div>
      {children}
    </section>
  )
}
