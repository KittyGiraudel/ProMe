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
import { setCharacterStore } from '@/lib/character/store'
import { createLocalStorageCharacterStore } from '@/lib/character/store/localStorageStore'
import { createRemoteCharacterStore } from '@/lib/character/store/remoteStore'

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
    console.log(nextUser)
    setUser(nextUser)
    if (nextUser) {
      setCharacterStore(createRemoteCharacterStore())
    } else {
      setCharacterStore(createLocalStorageCharacterStore())
    }
  }, [])

  useEffect(() => {
    // Handle OAuth redirect callbacks first.
    handleAuthCallback()
      .then(result => {
        console.log(result)
        if (result) {
          applyUser(result.user)
          setLoading(false)
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
