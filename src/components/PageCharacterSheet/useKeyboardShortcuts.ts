import { FormInstance } from 'antd/es/form'
import { useEffect } from 'react'

export function useKeyboardShortcuts({
  form,
  isDead,
}: {
  form: FormInstance
  isDead: boolean
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        if (!isDead) form.submit()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [form, isDead])
}
