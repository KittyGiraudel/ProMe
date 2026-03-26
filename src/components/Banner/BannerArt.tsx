'use client'

import { useId } from 'react'

/** Inline cover illustration so fills can follow CSS variables (background SVG cannot). */
export function BannerArt() {
  const raw = useId()
  const g = raw.replace(/\W/g, '')

  return (
    <svg
      className='page-cover__art'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 1600 420'
      fill='none'
      preserveAspectRatio='xMidYMax slice'
      width='100%'
      height='100%'
      aria-hidden>
      <defs>
        <linearGradient id={`${g}-sky`} x1={0} y1={0} x2={0} y2={1}>
          <stop offset='0%' stopColor='var(--pc-sky-top)' />
          <stop offset='55%' stopColor='var(--pc-sky-mid)' />
          <stop offset='100%' stopColor='var(--pc-sky-bot)' />
        </linearGradient>
        <linearGradient id={`${g}-haze`} x1={0} y1={0} x2={1} y2={0}>
          <stop offset='0%' stopColor='var(--pc-haze-edge)' stopOpacity={0} />
          <stop
            offset='50%'
            stopColor='var(--pc-haze-mid)'
            stopOpacity={0.22}
          />
          <stop offset='100%' stopColor='var(--pc-haze-edge)' stopOpacity={0} />
        </linearGradient>
        <radialGradient id={`${g}-glow`} cx='72%' cy='28%' r={1}>
          <stop offset='0%' stopColor='var(--pc-glow-0)' stopOpacity={0.95} />
          <stop offset='45%' stopColor='var(--pc-glow-1)' stopOpacity={0.35} />
          <stop offset='100%' stopColor='var(--pc-glow-2)' stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${g}-hill-far`} x1={0} y1={0} x2={0} y2={1}>
          <stop offset='0%' stopColor='var(--pc-hill-far-t)' />
          <stop offset='100%' stopColor='var(--pc-hill-far-b)' />
        </linearGradient>
        <linearGradient id={`${g}-hill-near`} x1={0} y1={0} x2={0} y2={1}>
          <stop offset='0%' stopColor='var(--pc-hill-near-t)' />
          <stop offset='100%' stopColor='var(--pc-hill-near-b)' />
        </linearGradient>
      </defs>
      <rect width={1600} height={420} fill={`url(#${g}-sky)`} />
      <rect width={1600} height={420} fill={`url(#${g}-haze)`} />
      <ellipse cx={1180} cy={80} rx={520} ry={200} fill={`url(#${g}-glow)`} />
      <path
        fill={`url(#${g}-hill-far)`}
        fillOpacity={0.55}
        d='M0 280 C 200 220 380 260 560 235 C 740 210 900 250 1100 228 C 1280 208 1420 248 1600 215 V 420 H 0 Z'
      />
      <path
        fill={`url(#${g}-hill-far)`}
        fillOpacity={0.75}
        d='M0 310 C 240 265 420 295 640 268 C 860 242 1020 278 1220 255 C 1380 238 1500 268 1600 248 V 420 H 0 Z'
      />
      <path
        fill={`url(#${g}-hill-near)`}
        fillOpacity={0.35}
        d='M0 340 C 280 300 500 330 760 302 C 980 280 1180 318 1400 295 C 1500 285 1560 302 1600 295 V 420 H 0 Z'
      />
      <path
        fill='var(--pc-foreground-mist)'
        fillOpacity={0.12}
        d='M0 368 C 320 338 540 358 800 335 C 1040 315 1260 348 1600 318 V 420 H 0 Z'
      />
    </svg>
  )
}
