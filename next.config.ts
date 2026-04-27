import withSerwistInit from '@serwist/next'
import { execSync } from 'child_process'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// Use git commit hash as cache version
const revision = execSync('git rev-parse HEAD', { encoding: 'utf8' })
  .trim()
  .slice(0, 7)

const withSerwist = withSerwistInit({
  cacheOnNavigation: true,
  reloadOnOnline: false,
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_COMMIT_SHA: revision,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https:",
              "media-src 'self' https://pub-6f5ba7aac9c745d3ac681827814ac01a.r2.dev",
              'frame-src https://www.youtube.com',
              "frame-ancestors 'none'",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
          {
            key: 'Permissions-Policy',
            value:
              'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()',
          },
        ],
      },
    ]
  },
}

const withNextIntl = createNextIntlPlugin()
export default withSerwist(withNextIntl(nextConfig))
