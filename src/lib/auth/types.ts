/** Shape returned by @netlify/identity's getUser() / login() / signup(). */
export type NetlifyUser = {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    [key: string]: unknown
  }
  token: {
    access_token: string
    expires_at: number
    refresh_token: string
    token_type: 'bearer'
  }
}
