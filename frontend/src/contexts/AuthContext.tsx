'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import api from '@/lib/api'

interface AuthUser {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function persistToken(token: string | null) {
  if (token) {
    localStorage.setItem('auth_token', token)
    document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`
  } else {
    localStorage.removeItem('auth_token')
    document.cookie = 'auth_token=; path=/; max-age=0'
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('auth_token')
    if (!stored) {
      setIsLoading(false)
      return
    }
    setToken(stored)
    api
      .get<AuthUser>('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        persistToken(null)
        setToken(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post<{ accessToken: string }>('/auth/login', { email, password })
    persistToken(data.accessToken)
    setToken(data.accessToken)
    const { data: me } = await api.get<AuthUser>('/auth/me')
    setUser(me)
  }

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post<{ accessToken: string }>('/auth/register', {
      name,
      email,
      password,
    })
    persistToken(data.accessToken)
    setToken(data.accessToken)
    const { data: me } = await api.get<AuthUser>('/auth/me')
    setUser(me)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    persistToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
