import './VisuallyHidden.css'

export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className='VisuallyHidden'>{children}</span>
}
