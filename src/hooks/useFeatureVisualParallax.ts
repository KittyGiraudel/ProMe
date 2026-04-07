import { useEffect, useRef } from 'react'
import { getFeatureVisualParallax } from '@/components/LandingPage/featureParallax'

type Options = {
  reversed: boolean
}

type Subscriber = {
  el: HTMLDivElement
  reversed: boolean
}

const subscribers = new Set<Subscriber>()
let rafId: number | null = null
let isBound = false

function clearParallaxStyles(el: HTMLDivElement) {
  el.style.removeProperty('--feature-visual-shift-y')
  el.style.removeProperty('--feature-visual-rotate-x')
  el.style.removeProperty('--feature-visual-rotate-y')
}

function updateAllParallax() {
  rafId = null

  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches
  const isSmallScreen = window.matchMedia('(max-width: 1024px)').matches
  const shouldDisable = prefersReduced || isSmallScreen

  for (const { el, reversed } of subscribers) {
    if (shouldDisable) {
      clearParallaxStyles(el)
      continue
    }

    const rect = el.getBoundingClientRect()
    const parallax = getFeatureVisualParallax({
      rectTop: rect.top,
      rectHeight: rect.height,
      viewportHeight: window.innerHeight,
      reversed,
    })

    el.style.setProperty('--feature-visual-shift-y', `${parallax.translateY}px`)
    el.style.setProperty('--feature-visual-rotate-x', `${parallax.rotateX}deg`)
    el.style.setProperty('--feature-visual-rotate-y', `${parallax.rotateY}deg`)
  }
}

function requestParallaxUpdate() {
  if (rafId !== null) return
  rafId = window.requestAnimationFrame(updateAllParallax)
}

function bindGlobalListeners() {
  if (isBound) return
  isBound = true
  window.addEventListener('scroll', requestParallaxUpdate, { passive: true })
  window.addEventListener('resize', requestParallaxUpdate)
}

function unbindGlobalListeners() {
  if (!isBound) return
  isBound = false
  window.removeEventListener('scroll', requestParallaxUpdate)
  window.removeEventListener('resize', requestParallaxUpdate)
}

export function useFeatureVisualParallax({ reversed }: Options) {
  const visualRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const visualEl = visualRef.current
    if (!visualEl) return

    const subscriber: Subscriber = { el: visualEl, reversed }
    subscribers.add(subscriber)
    bindGlobalListeners()
    requestParallaxUpdate()

    return () => {
      subscribers.delete(subscriber)
      clearParallaxStyles(visualEl)

      if (subscribers.size === 0) {
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId)
          rafId = null
        }
        unbindGlobalListeners()
      }
    }
  }, [reversed])

  return visualRef
}
