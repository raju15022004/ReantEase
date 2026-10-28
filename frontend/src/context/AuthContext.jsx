import { createContext, useContext, useMemo, useState } from 'react'
import { setAccessToken } from '../services/api'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  function acceptSession(session) {
    setUser(session.user)
    setToken(session.token)
    setAccessToken(session.token)
    return session.user
  }

  async function login(credentials) {
    return acceptSession(await authService.login(credentials))
  }

  async function register(details) {
    return acceptSession(await authService.register(details))
  }

  function logout() {
    setUser(null)
    setToken(null)
    setAccessToken(null)
  }

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider')
  return value
}
