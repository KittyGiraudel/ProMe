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
  reactStrictMode: false,
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
        ],
      },
    ]
  },
}

const withNextIntl = createNextIntlPlugin()
export default withSerwist(withNextIntl(nextConfig))
