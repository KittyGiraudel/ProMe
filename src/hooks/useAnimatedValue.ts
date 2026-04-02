import { useEffect, useRef, useState } from 'react'

export function useAnimatedValue<T>(generator: () => T) {
  const [value, setValue] = useState<T | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(function clearTimeoutOnUnmount() {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const start = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setValue(generator())

    intervalRef.current = setInterval(() => {
      setValue(generator())
    }, 90)

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setValue(generator())
      setIsAnimating(false)
      timeoutRef.current = null
    }, 1400)
  }

  return { value, isAnimating, start }
}
