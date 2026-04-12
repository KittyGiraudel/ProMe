'use client'

import {
  getUser,
  handleAuthCallback,
  logout,
  type User as NetlifyUser,
  oauthLogin as netlifyOAuthLogin,
} from '@netlify/identity'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { characterStore } from '@/lib/character/store'

type AuthContextValue = {
  user: NetlifyUser | null
  loading: boolean
  oauthLogin: () => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NetlifyUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Update the global character store whenever auth state changes.
  const applyUser = useCallback((nextUser: NetlifyUser | null) => {
    setUser(nextUser)
    if (nextUser) {
      characterStore.login().catch(error => {
        console.error('Login sync failed:', error)
      })
    } else {
      characterStore.logout()
    }
  }, [])

  useEffect(() => {
    // Handle OAuth redirect callbacks first.
    handleAuthCallback()
      .then(result => {
        if (result) {
          applyUser(result.user)
          setLoading(false)
          window.location.href = '/'
          return
        }

        // Otherwise, check for an existing session.
        return getUser().then(currentUser => applyUser(currentUser))
      })
      .catch(error => {
        console.error(error)
      })
      .finally(() => setLoading(false))
  }, [applyUser])

  const handleOAuthLogin = useCallback(() => {
    // Redirects to Google — no await. handleAuthCallback handles the return.
    netlifyOAuthLogin('google')
  }, [])

  const handleLogout = useCallback(async () => {
    await logout()
    applyUser(null)
    window.location.href = '/'
  }, [applyUser])

  const context = useMemo(
    () => ({
      user,
      loading,
      oauthLogin: handleOAuthLogin,
      logout: handleLogout,
    }),
    [user, loading, handleOAuthLogin, handleLogout]
  )

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
