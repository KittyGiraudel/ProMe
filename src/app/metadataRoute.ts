import { routes, routing } from '@/i18n/routing'
import { biomeIdToSlug, slugToBiomeId } from '@/lib/biomes/biomeSlug'

type Locale = (typeof routing.locales)[number]
type RouteName = keyof typeof routes
type AlternatesLanguages = Record<Locale, string> & { 'x-default': string }
type Alternates = { canonical: string; languages: AlternatesLanguages }

type Params = Record<string, string>

function localizeParamsForLocale(
  routeName: RouteName,
  sourceLocale: Locale,
  targetLocale: Locale,
  params?: Params
): Params | undefined {
  if (!params) return undefined
  if (routeName !== 'biome' || !params.biome) return params

  const biomeId = slugToBiomeId(params.biome, sourceLocale)
  if (!biomeId) return params

  return { ...params, biome: biomeIdToSlug(biomeId, targetLocale) }
}

function applyParams(pathname: string, params?: Params): string {
  if (!params) return pathname
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`[${key}]`, value),
    pathname
  )
}

export function withLocalePrefix(locale: Locale, pathname: string): string {
  return pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
}

export function getLocalizedRoutePath(
  routeName: RouteName,
  locale: Locale,
  params?: Params
): string {
  return applyParams(routes[routeName].localized[locale], params)
}

export function buildAlternates(
  routeName: RouteName,
  locale: Locale,
  params?: Params
): Alternates {
  const canonicalParams = localizeParamsForLocale(
    routeName,
    locale,
    locale,
    params
  )
  const canonicalPath = getLocalizedRoutePath(
    routeName,
    locale,
    canonicalParams
  )
  const languages = Object.fromEntries(
    routing.locales.map(targetLocale => [
      targetLocale,
      withLocalePrefix(
        targetLocale,
        getLocalizedRoutePath(
          routeName,
          targetLocale,
          localizeParamsForLocale(routeName, locale, targetLocale, params)
        )
      ),
    ])
  ) as Record<Locale, string>

  return {
    canonical: withLocalePrefix(locale, canonicalPath),
    languages: {
      ...languages,
      'x-default': withLocalePrefix(
        routing.defaultLocale,
        getLocalizedRoutePath(
          routeName,
          routing.defaultLocale,
          localizeParamsForLocale(
            routeName,
            locale,
            routing.defaultLocale,
            params
          )
        )
      ),
    },
  }
}
