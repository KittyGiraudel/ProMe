'use client'

import { useEffect, useRef } from 'react'
import './Spiral.css'

// Hypotrochoid parameters — R=6, r=1, d=3 gives the six-petal shape
const R = 6,
  r = 1,
  D = 3,
  SCALE = 3.5,
  BREATH = 0.45
const PARTICLES = 86
const TRAIL_SPAN = 0.34
const DURATION_MS = 4_600 * 5
const ROTATION_MS = 28000 * 2
const PULSE_MS = 4200

function spiralPoint(progress: number, detailScale: number) {
  const t = progress * Math.PI * 2
  const dd = D + detailScale * 0.25
  const x = (R - r) * Math.cos(t) + dd * Math.cos(((R - r) / r) * t)
  const y = (R - r) * Math.sin(t) - dd * Math.sin(((R - r) / r) * t)
  const s = SCALE + detailScale * BREATH
  return { x: 50 + x * s, y: 50 + y * s }
}

function norm(p: number) {
  return ((p % 1) + 1) % 1
}

function getDetailScale(time: number) {
  const p = (time % PULSE_MS) / PULSE_MS
  return 0.52 + ((Math.sin(p * Math.PI * 2 + 0.55) + 1) / 2) * 0.48
}

function buildPath(ds: number) {
  return Array.from({ length: 481 }, (_, i) => {
    const p = spiralPoint(i / 480, ds)
    return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`
  }).join(' ')
}

export function Spiral() {
  const svgRef = useRef<SVGSVGElement>(null)
  const groupRef = useRef<SVGGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const circlesRef = useRef<(SVGCircleElement | null)[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
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
      const rotation = -((time % ROTATION_MS) / ROTATION_MS) * 360

      groupRef.current?.setAttribute('transform', `rotate(${rotation} 50 50)`)
      pathRef.current?.setAttribute('d', buildPath(ds))

      for (let i = 0; i < PARTICLES; i++) {
        const el = circlesRef.current[i]
        if (!el) continue
        const tailOffset = i / (PARTICLES - 1)
        const p = spiralPoint(norm(progress - tailOffset * TRAIL_SPAN), ds)
        const fade = Math.pow(1 - tailOffset, 0.56)
        el.setAttribute('cx', p.x.toFixed(2))
        el.setAttribute('cy', p.y.toFixed(2))
        el.setAttribute('r', (0.9 + fade * 2.7).toFixed(2))
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
        if (isInView) {
          start()
          return
        }
        stop()
      },
      { threshold: 0.01 }
    )

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stop()
        return
      }
      start()
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
    <svg ref={svgRef} className='SpiralVisual' viewBox='0 0 100 100' role='img'>
      <g ref={groupRef}>
        <path
          ref={pathRef}
          fill='none'
          stroke='currentColor'
          strokeWidth='0.4'
          strokeOpacity='0.2'
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
      </g>
    </svg>
  )
}
