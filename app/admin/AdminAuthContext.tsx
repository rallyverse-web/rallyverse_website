'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

type AdminAuthContextType = {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()

    const init = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
      setLoading(false)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: { user: User } | null) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await getSupabaseClient().auth.signOut()
  }

  return (
    <AdminAuthContext.Provider value={{ user, loading, logout }}>
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
