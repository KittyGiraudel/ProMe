import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Canonical identity tab lives at `/characters/[id]/identity`.
 * Bare `/characters/[id]` redirects here; `/characters/new` is excluded.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const m = pathname.match(/^\/characters\/([^/]+)$/)
  if (!m) return NextResponse.next()
  const id = m[1]
  if (id === 'new') return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/characters/${id}/identity`
  return NextResponse.redirect(url, 308)
}

export const config = {
  matcher: ['/characters/:path*'],
}
