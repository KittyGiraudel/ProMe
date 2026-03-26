'use client'

import { useId } from 'react'
import { useTranslations } from 'next-intl'
import { isClockDayPhase } from '@/lib/character/clock'
import './ClockDisplay.css'

type ClockDisplayProps = {
  label: string
  totalSegments: number
  segmentsPerHalf: number
  position: number
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number
) {
  const angleRad = (angleDeg * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  }
}

function describeSectorPath(
  cx: number,
  cy: number,
  radius: number,
  startAngleDeg: number,
  endAngleDeg: number
) {
  const start = polarToCartesian(cx, cy, radius, startAngleDeg)
  const end = polarToCartesian(cx, cy, radius, endAngleDeg)
  const delta = endAngleDeg - startAngleDeg
  const normalizedDelta = ((delta % 360) + 360) % 360
  const largeArcFlag = normalizedDelta > 180 ? 1 : 0

  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`
}

export function ClockDisplay({
  label,
  totalSegments,
  segmentsPerHalf,
  position,
}: ClockDisplayProps) {
  const t = useTranslations()
  const uid = useId().replace(/:/g, '')
  const svgSize = 220
  const center = svgSize / 2
  const radius = 92
  const grad = {
    dayBase: `clock-day-base-${uid}`,
    dayCurrent: `clock-day-current-${uid}`,
    nightBase: `clock-night-base-${uid}`,
    nightCurrent: `clock-night-current-${uid}`,
  }
  const stepDeg = 360 / totalSegments
  const startDeg = -180
  const currentMidAngle = startDeg + (position + 0.5) * stepDeg
  const markerPoint = polarToCartesian(
    center,
    center,
    radius - 18,
    currentMidAngle
  )

  return (
    <svg
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      width='100%'
      className='ClockDisplay'
      role='img'
      aria-label={label}>
      <defs>
        <radialGradient
          id={grad.dayBase}
          cx={center}
          cy={center}
          r={radius}
          gradientUnits='userSpaceOnUse'>
          <stop offset='0%' stopColor='#fff8e6' />
          <stop offset='55%' stopColor='#f5e2a8' />
          <stop offset='100%' stopColor='#e8c97a' />
        </radialGradient>
        <radialGradient
          id={grad.dayCurrent}
          cx={center}
          cy={center}
          r={radius}
          gradientUnits='userSpaceOnUse'>
          <stop offset='0%' stopColor='#ffe58f' />
          <stop offset='45%' stopColor='#ffc53d' />
          <stop offset='100%' stopColor='#d48806' />
        </radialGradient>
        <radialGradient
          id={grad.nightBase}
          cx={center}
          cy={center}
          r={radius}
          gradientUnits='userSpaceOnUse'>
          <stop offset='0%' stopColor='#f4f9ff' />
          <stop offset='55%' stopColor='#d4e5fc' />
          <stop offset='100%' stopColor='#a8c8f0' />
        </radialGradient>
        <radialGradient
          id={grad.nightCurrent}
          cx={center}
          cy={center}
          r={radius}
          gradientUnits='userSpaceOnUse'>
          <stop offset='0%' stopColor='#91caff' />
          <stop offset='45%' stopColor='#4096ff' />
          <stop offset='100%' stopColor='#0958d9' />
        </radialGradient>
      </defs>
      {Array.from({ length: totalSegments }).map((_, index) => {
        const sliceStart = startDeg + index * stepDeg
        const sliceEnd = sliceStart + stepDeg
        const inDay = isClockDayPhase(index, segmentsPerHalf)
        const isCurrent = index === position
        const fillId = inDay
          ? isCurrent
            ? grad.dayCurrent
            : grad.dayBase
          : isCurrent
            ? grad.nightCurrent
            : grad.nightBase

        return (
          <path
            key={index}
            d={describeSectorPath(center, center, radius, sliceStart, sliceEnd)}
            fill={`url(#${fillId})`}
            fillOpacity={isCurrent ? 0.95 : 0.55}
            stroke='#595959'
            strokeWidth={1}
          />
        )
      })}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill='none'
        stroke='#262626'
        strokeWidth={2}
      />
      <line
        x1={center - radius}
        y1={center}
        x2={center + radius}
        y2={center}
        stroke='#262626'
        strokeWidth={2}
      />
      <circle
        cx={markerPoint.x}
        cy={markerPoint.y}
        r={6}
        fill='#141414'
        stroke='white'
        strokeWidth={2}
      />
      <text
        x={center}
        y={center - 35}
        textAnchor='middle'
        fontSize='20'
        fill='#262626'
        fillOpacity='0.45'
        fontWeight='700'
        letterSpacing='3'>
        {t('characters.map.clock_day').toUpperCase()}
      </text>
      <text
        x={center}
        y={center + 55}
        textAnchor='middle'
        fontSize='20'
        fill='#262626'
        fillOpacity='0.45'
        fontWeight='700'
        letterSpacing='3'>
        {t('characters.map.clock_night').toUpperCase()}
      </text>
    </svg>
  )
}
