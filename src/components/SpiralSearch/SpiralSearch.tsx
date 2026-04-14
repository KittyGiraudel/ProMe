'use client'

import { useEffect, useRef } from 'react'
import './SpiralSearch.css'

// Archimedean Spiral Search — angle and radius modulation use separate variables:
//   t ∈ [0, 2π] drives the cosine radius pulse (one full period)
//   angle = t * TURNS drives the actual rotation (4 full turns)
const TURNS = 4
const BASE_RADIUS = 16
const RADIUS_AMP = 8.5
const SPIRAL_SCALE = 1
const PULSE_AMOUNT = 2.4
const PARTICLES = 86
const TRAIL_SPAN = 0.28
const DURATION_MS = 7800
const PULSE_MS = 6800

function spiralPoint(progress: number, detailScale: number) {
  const t = progress * Math.PI * 2
  const angle = t * TURNS
  const r =
    BASE_RADIUS + (1 - Math.cos(t)) * (RADIUS_AMP + detailScale * PULSE_AMOUNT)
  return {
    x: 50 + Math.cos(angle) * r * SPIRAL_SCALE,
    y: 50 + Math.sin(angle) * r * SPIRAL_SCALE,
  }
}

function norm(p: number) {
  return ((p % 1) + 1) % 1
}

function getDetailScale(time: number) {
  const p = (time % PULSE_MS) / PULSE_MS
  return 0.52 + ((Math.sin(p * Math.PI * 2 + 0.55) + 1) / 2) * 0.48
}

function buildPath(ds: number) {
  return Array.from({ length: 361 }, (_, i) => {
    const p = spiralPoint(i / 360, ds)
    return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`
  }).join(' ')
}

export function SpiralSearch() {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const circlesRef = useRef<(SVGCircleElement | null)[]>([])
  const rafRef = useRef<number>(0)

  useEffect(function animateSpiralSearch() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const svgEl = svgRef.current
    if (!svgEl) return

    let startTime: number | null = null
    let pausedAt: number | null = null
    let isRunning = false
    let isInView = false

    function tick(now: number) {
      if (!isRunning) return
      if (startTime === null) startTime = now
      const time = now - startTime

      const progress = (time % DURATION_MS) / DURATION_MS
      const ds = getDetailScale(time)

      pathRef.current?.setAttribute('d', buildPath(ds))

      for (let i = 0; i < PARTICLES; i++) {
        const el = circlesRef.current[i]
        if (!el) continue
        const tailOffset = i / (PARTICLES - 1)
        const p = spiralPoint(norm(progress - tailOffset * TRAIL_SPAN), ds)
        const fade = Math.pow(1 - tailOffset, 0.56)
        el.setAttribute('cx', p.x.toFixed(2))
        el.setAttribute('cy', p.y.toFixed(2))
        el.setAttribute('r', (0.6 + fade * 1.8).toFixed(2))
        el.setAttribute('opacity', (0.04 + fade * 0.96).toFixed(3))
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    const stop = () => {
      if (!isRunning) return
      isRunning = false
      pausedAt = performance.now()
      cancelAnimationFrame(rafRef.current)
    }

    const start = () => {
      if (isRunning || !isInView || document.visibilityState === 'hidden')
        return
      if (pausedAt !== null && startTime !== null) {
        startTime += performance.now() - pausedAt
      }
      pausedAt = null
      isRunning = true
      rafRef.current = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting
        isInView ? start() : stop()
      },
      { threshold: 0.01 }
    )

    const onVisibilityChange = () => {
      document.visibilityState === 'hidden' ? stop() : start()
    }

    observer.observe(svgEl)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      stop()
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className='SpiralSearchVisual'
      viewBox='0 0 100 100'
      role='img'
      aria-hidden='true'>
      <path
        ref={pathRef}
        fill='none'
        stroke='currentColor'
        strokeWidth='1'
        strokeOpacity='0.25'
      />
      {Array.from({ length: PARTICLES }, (_, i) => (
        <circle
          key={i}
          ref={el => {
            circlesRef.current[i] = el
          }}
          fill='currentColor'
        />
      ))}
    </svg>
  )
}
