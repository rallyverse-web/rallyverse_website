'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type AdminAuthContextType = {
  token: string
  setToken: (token: string) => void
  loading: boolean
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rallyverse-admin-token')
      if (saved) {
        setTokenState(saved)
      }
    } catch (e) {
      console.error('Failed to load admin token', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const setToken = (newToken: string) => {
    setTokenState(newToken)
    try {
      if (newToken) {
        localStorage.setItem('rallyverse-admin-token', newToken)
      } else {
        localStorage.removeItem('rallyverse-admin-token')
      }
    } catch (e) {
      console.error('Failed to save admin token', e)
    }
  }

  const logout = () => {
    setToken('')
  }

  return (
    <AdminAuthContext.Provider value={{ token, setToken, loading, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
