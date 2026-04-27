import { createNavigation } from 'next-intl/navigation'
import { type RouteName, routes, routing } from './routing'

/**
 * Locale-aware navigation helpers generated from the centralized next-intl
 * routing configuration.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)

/** Href type accepted by `router.push`/`router.replace`. */
type RouterHref = Parameters<ReturnType<typeof useRouter>['push']>[0]

/** Route params for routes that require them. */
type RouteParamsByName = {
  biome: { biome: string }
  character: { id: string }
  npc: { id: string }
  village: { id: string }
}

/** Route query params for routes that support them. */
type RouteQueryByName = {
  villageGenerator: { f?: string }
  village: { f?: string }
}

type ParamsFor<N extends RouteName> = N extends keyof RouteParamsByName
  ? RouteParamsByName[N]
  : undefined
type QueryFor<N extends RouteName> = N extends keyof RouteQueryByName
  ? RouteQueryByName[N]
  : undefined

/**
 * Typed "named route" input object for a specific route name.
 * Conditionally requires `params`/`query` based on route capabilities.
 */
type RouteToObject<N extends RouteName> =
  ParamsFor<N> extends undefined
    ? QueryFor<N> extends undefined
      ? { route: N; hash?: string }
      : { route: N; query?: QueryFor<N>; hash?: string }
    : QueryFor<N> extends undefined
      ? { route: N; params: ParamsFor<N>; hash?: string }
      : {
          route: N
          params: ParamsFor<N>
          query?: QueryFor<N>
          hash?: string
        }

/**
 * Public route object used across the app for navigation intents.
 *
 * @example
 * { route: 'home' }
 * { route: 'character', params: { id: 'abc' } }
 * { route: 'biome', params: { biome: 'swamp' }, hash: 'biome-map' }
 */
export type AppRouteTo = { [N in RouteName]: RouteToObject<N> }[RouteName]

/**
 * Converts an `AppRouteTo` object into a Next.js router-compatible href.
 * This does not localize the pathname.
 */
export function toRouterHref(to: AppRouteTo): RouterHref {
  const route = routes[to.route]
  const hash = to.hash
  if ('params' in to && to.params) {
    return {
      pathname: route.pathname,
      params: to.params,
      query: 'query' in to ? to.query : undefined,
      hash,
    } as RouterHref
  }

  return {
    pathname: route.pathname,
    query: 'query' in to ? to.query : undefined,
    hash,
  } as RouterHref
}

/**
 * Resolves an app route object to a locale-aware URL string.
 * Useful for DOM-only href attributes that require a string value.
 */
export function resolveAppToString(
  to: AppRouteTo,
  locale: (typeof routing.locales)[number]
): string {
  const href = toRouterHref(to)
  const hash = to.hash
  const pathname = getPathname({ locale, href })

  return hash ? `${pathname}#${hash}` : pathname
}
