import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Keep the default broad matcher (excluding APIs/internal paths and dotted assets),
  // but explicitly include locale-prefixed app routes so dynamic IDs containing dots
  // (e.g. village share IDs) still go through next-intl middleware.
  matcher: ['/(fr|en)/:path*', '/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
}
