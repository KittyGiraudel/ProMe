import type { MetadataRoute } from 'next'

const isDev = process.env.NODE_ENV === 'development'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: isDev ? 'ProMe (dev)' : 'ProMe',
    short_name: isDev ? 'ProMe (dev)' : 'ProMe',
    description: 'A companion app for the Protector’s Memories solo TTRPG.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: isDev
          ? '/web-app-manifest-192x192-dev.png'
          : '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: isDev
          ? '/web-app-manifest-512x512-dev.png'
          : '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
