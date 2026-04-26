import type { MetadataRoute } from 'next'
import { BIOME_IDS } from '@/constants/misc'
import { routing } from '@/i18n/routing'
import { biomeIdToSlug } from '@/lib/biomes/biomeSlug'

const BASE_URL = 'https://prome.games'
const locales = routing.locales

function url(path: string): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const homeEntries = locales.map(locale => url(`/${locale}`))

  const staticRoutes = [
    '/faq',
    '/generators/npc',
    '/generators/village',
    '/settings',
  ]
  const staticEntries = locales.flatMap(locale =>
    staticRoutes.map(route => url(`/${locale}${route}`))
  )

  const biomeEntries = locales.flatMap(locale =>
    BIOME_IDS.map(id => url(`/${locale}/biomes/${biomeIdToSlug(id)}`))
  )

  return [...homeEntries, ...staticEntries, ...biomeEntries]
}
