import type { MetadataRoute } from 'next'
import { getTranslations } from 'next-intl/server'

const isDev = process.env.NODE_ENV === 'development'

export default async function manifest(): Promise<
  Omit<MetadataRoute.Manifest, 'description'> & {
    description: Record<string, { value: string }>
  }
> {
  const en = await getTranslations({ locale: 'en' })
  const fr = await getTranslations({ locale: 'fr' })

  return {
    name: isDev ? 'ProMe (dev)' : 'ProMe',
    short_name: isDev ? 'ProMe (dev)' : 'ProMe',
    description: {
      en: { value: en('metadata.description') },
      fr: { value: fr('metadata.description') },
    },
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: isDev
          ? '/web-app-manifest-192x192-dev.png'
          : '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: isDev
          ? '/web-app-manifest-512x512-dev.png'
          : '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
