import { useEffect, useRef } from 'react'

/**
 * Attaches an IntersectionObserver to the returned ref. When the element
 * enters the viewport, adds the `FadeIn--visible` class which triggers the
 * CSS transition defined in LandingFeature.css and LandingFinalCta.css.
 * Respects prefers-reduced-motion.
 */
export function useFadeIn<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(function fadeIn() {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReduced) {
      el.classList.add('FadeIn--visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('FadeIn--visible')
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
