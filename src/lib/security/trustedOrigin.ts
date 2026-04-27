import { NO_STORE_HEADERS } from '@/lib/security/cacheControl'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

function getRequestOrigin(request: Request): string | null {
  const origin = request.headers.get('origin')
  if (origin) return origin

  const referer = request.headers.get('referer')
  if (!referer) return null

  try {
    return new URL(referer).origin
  } catch {
    return null
  }
}

/**
 * Basic CSRF mitigation for cookie-authenticated endpoints:
 * reject state-changing requests that do not come from this origin.
 */
export function enforceTrustedOrigin(request: Request): Response | null {
  if (SAFE_METHODS.has(request.method.toUpperCase())) return null

  const sourceOrigin = getRequestOrigin(request)
  if (!sourceOrigin) {
    return Response.json(
      { error: 'Forbidden origin' },
      { status: 403, headers: NO_STORE_HEADERS }
    )
  }

  const targetOrigin = new URL(request.url).origin
  if (sourceOrigin !== targetOrigin) {
    return Response.json(
      { error: 'Forbidden origin' },
      { status: 403, headers: NO_STORE_HEADERS }
    )
  }

  return null
}
