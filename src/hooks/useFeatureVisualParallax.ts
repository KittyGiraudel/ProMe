import { useEffect, useRef } from 'react'
import { getFeatureVisualParallax } from '@/components/LandingPage/featureParallax'

type Options = {
  reversed: boolean
}

export function useFeatureVisualParallax({ reversed }: Options) {
  const visualRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const visualEl = visualRef.current
    if (!visualEl) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const isSmallScreen = window.matchMedia('(max-width: 1024px)').matches

    if (prefersReduced || isSmallScreen) {
      visualEl.style.removeProperty('--feature-visual-shift-y')
      visualEl.style.removeProperty('--feature-visual-rotate-x')
      visualEl.style.removeProperty('--feature-visual-rotate-y')
      return
    }

    let rafId: number | null = null

    const updateParallax = () => {
      rafId = null
      const rect = visualEl.getBoundingClientRect()
      const parallax = getFeatureVisualParallax({
        rectTop: rect.top,
        rectHeight: rect.height,
        viewportHeight: window.innerHeight,
        reversed,
      })

      visualEl.style.setProperty(
        '--feature-visual-shift-y',
        `${parallax.translateY}px`
      )
      visualEl.style.setProperty(
        '--feature-visual-rotate-x',
        `${parallax.rotateX}deg`
      )
      visualEl.style.setProperty(
        '--feature-visual-rotate-y',
        `${parallax.rotateY}deg`
      )
    }

    const requestParallaxUpdate = () => {
      if (rafId !== null) return
      rafId = window.requestAnimationFrame(updateParallax)
    }

    requestParallaxUpdate()
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true })
    window.addEventListener('resize', requestParallaxUpdate)

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
      window.removeEventListener('scroll', requestParallaxUpdate)
      window.removeEventListener('resize', requestParallaxUpdate)
    }
  }, [reversed])

  return visualRef
}
