import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase, authHelpers } from '../lib/supabase'
import type { User as AppUser } from '../types/supabase'

interface AuthContextType {
  session: Session | null
  user: User | null
  appUser: AppUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
  updatePassword: (password: string) => Promise<{ error: any }>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { session } = await authHelpers.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchAppUser(session.user.id)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchAppUser(session.user.id)
        } else {
          setAppUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchAppUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching app user:', error)
        return
      }

      setAppUser(data)
    } catch (error) {
      console.error('Error fetching app user:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await authHelpers.signIn(email, password)
    return { error }
  }

  const signUp = async (email: string, password: string, metadata: any = {}) => {
    const { error } = await authHelpers.signUp(email, password, metadata)
    return { error }
  }

  const signOut = async () => {
    const { error } = await authHelpers.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await authHelpers.resetPassword(email)
    return { error }
  }

  const updatePassword = async (password: string) => {
    const { error } = await authHelpers.updatePassword(password)
    return { error }
  }

  const refreshUser = async () => {
    if (user) {
      await fetchAppUser(user.id)
    }
  }

  const value = {
    session,
    user,
    appUser,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}