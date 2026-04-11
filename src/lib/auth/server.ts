import * as jose from 'jose'

// NETLIFY_IDENTITY_URL must be set manually in Netlify environment variables (see Task 1).
// Falls back to constructing from URL, which Netlify does inject automatically.
const identityUrl =
  process.env.NETLIFY_IDENTITY_URL ??
  (process.env.URL ? `${process.env.URL}/.netlify/identity` : null)
console.log(identityUrl)

if (!identityUrl) {
  throw new Error(
    'Cannot determine Netlify Identity URL. Set NETLIFY_IDENTITY_URL in environment variables.'
  )
}

const JWKS = jose.createRemoteJWKSet(
  new URL(`${identityUrl}/.well-known/jwks.json`)
)

export type AuthenticatedUser = {
  id: string
  email: string
}

/**
 * Extracts and verifies the Bearer JWT from an incoming Request.
 * Returns the authenticated user or null if missing / invalid.
 */
export async function getAuthenticatedUser(
  req: Request
): Promise<AuthenticatedUser | null> {
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return null

  const token = auth.slice('Bearer '.length)
  try {
    const { payload } = await jose.jwtVerify(token, JWKS, {
      issuer: identityUrl as string,
    })
    const sub = payload.sub
    const email = payload.email as string | undefined
    if (!sub || !email) return null
    return { id: sub, email }
  } catch {
    return null
  }
}

/**
 * Returns a 401 JSON response. Use in API routes when auth fails.
 */
export function unauthorizedResponse(): Response {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
