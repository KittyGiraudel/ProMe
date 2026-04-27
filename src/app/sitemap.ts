import type { MetadataRoute } from 'next'
import { getLocalizedRoutePath, withLocalePrefix } from '@/app/metadataRoute'
import { BIOME_IDS } from '@/constants/misc'
import { routes, routing } from '@/i18n/routing'
import { biomeIdToSlug } from '@/lib/biomes/biomeSlug'

const BASE_URL = 'https://prome.games'
const locales = routing.locales

function generateSitemapEntry(path: string): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = (
    Object.keys(routes) as Array<keyof typeof routes>
  ).filter(name => !routes[name].pathname.includes('['))

  const staticEntries = locales.flatMap(locale =>
    staticRoutes.map(routeName =>
      generateSitemapEntry(
        withLocalePrefix(locale, getLocalizedRoutePath(routeName, locale))
      )
    )
  )

  const biomeEntries = locales.flatMap(locale =>
    BIOME_IDS.map(id =>
      generateSitemapEntry(
        withLocalePrefix(
          locale,
          getLocalizedRoutePath('biome', locale, {
            biome: biomeIdToSlug(id, locale),
          })
        )
      )
    )
  )

  return [...staticEntries, ...biomeEntries]
}
