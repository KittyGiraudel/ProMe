import { describe, expect, it, vi } from 'vitest'

vi.mock('next-intl/navigation', () => ({
  createNavigation: () => ({
    getPathname: ({
      href,
    }: {
      href: { pathname: string; params?: Record<string, string> }
    }) => {
      let path = href.pathname
      if (href.params) {
        for (const [key, val] of Object.entries(href.params)) {
          path = path.replace(`[${key}]`, val)
        }
      }
      return path
    },
    Link: null,
    redirect: null,
    usePathname: null,
    useRouter: null,
  }),
}))

const { resolveAppToString } = await import('./navigation')

describe('resolveAppToString', () => {
  it('returns the route pathname', () => {
    expect(resolveAppToString({ route: 'settings' }, 'en')).toBe('/settings')
  })

  it('interpolates dynamic params', () => {
    expect(
      resolveAppToString({ route: 'character', params: { id: 'abc' } }, 'en')
    ).toBe('/characters/abc')
  })

  it('appends hash when provided', () => {
    expect(
      resolveAppToString({ route: 'faq', hash: 'section-one' }, 'en')
    ).toBe('/faq#section-one')
  })

  it('appends hash to a dynamic route', () => {
    expect(
      resolveAppToString(
        { route: 'character', params: { id: 'xyz' }, hash: 'map' },
        'en'
      )
    ).toBe('/characters/xyz#map')
  })

  it('omits hash when not provided', () => {
    expect(resolveAppToString({ route: 'faq' }, 'en')).toBe('/faq')
  })
})
