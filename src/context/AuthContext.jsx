import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'truthlens_user'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY))
    } catch {
      return null
    }
  })

  const login = useCallback((email) => {
    const next = { name: email.split('@')[0], email }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
    setUser(next)
  }, [])

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}