'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  username: string
  display_name: string | null
  email: string | null
  avatar_url: string | null
  bio: string | null
  is_seller: boolean
  course_name: string | null
  course_tagline: string | null
  header_image_url: string | null
  tier: 'birdie' | 'eagle' | 'albatross' | 'hole_in_one'
  handicap_points: number
  created_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  signUp: (email: string, password: string, username: string, displayName?: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data as Profile
    } catch (err) {
      console.error('Error fetching profile:', err)
      return null
    }
  }, [supabase])

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }, [user, fetchProfile])

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
          if (mounted) {
            setIsLoading(false)
          }
          return
        }

        if (mounted) {
          setSession(currentSession)
          setUser(currentSession?.user ?? null)

          if (currentSession?.user) {
            const profileData = await fetchProfile(currentSession.user.id)
            setProfile(profileData)
          }

          setIsLoading(false)
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        if (!mounted) return

        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (currentSession?.user) {
          // Small delay to allow trigger to create profile
          setTimeout(async () => {
            const profileData = await fetchProfile(currentSession.user.id)
            if (mounted) {
              setProfile(profileData)
            }
          }, 500)
        } else {
          setProfile(null)
        }

        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          setProfile(null)
          router.push('/')
        } else if (event === 'PASSWORD_RECOVERY') {
          router.push('/reset-password')
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile, router])

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    username: string,
    displayName?: string
  ): Promise<{ error: Error | null }> => {
    try {
      // First check if username is taken
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .single()

      if (existingUser) {
        return { error: new Error('Username is already taken') }
      }

      // Validate username format
      const usernameRegex = /^[a-z0-9_]{3,20}$/
      if (!usernameRegex.test(username.toLowerCase())) {
        return { error: new Error('Username must be 3-20 characters, lowercase letters, numbers, and underscores only') }
      }

      // Validate password strength
      if (password.length < 8) {
        return { error: new Error('Password must be at least 8 characters') }
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.toLowerCase(),
            display_name: displayName || username,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          return { error: new Error('Invalid email or password') }
        }
        return { error }
      }

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  // Sign in with Google
  const signInWithGoogle = async (): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setSession(null)
      router.push('/')
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  // Reset password (send email)
  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  // Update password (after reset)
  const updatePassword = async (newPassword: string): Promise<{ error: Error | null }> => {
    try {
      if (newPassword.length < 8) {
        return { error: new Error('Password must be at least 8 characters') }
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  // Update profile
  const updateProfile = async (updates: Partial<Profile>): Promise<{ error: Error | null }> => {
    try {
      if (!user) {
        return { error: new Error('Not authenticated') }
      }

      // If updating username, validate it
      if (updates.username) {
        const usernameRegex = /^[a-z0-9_]{3,20}$/
        if (!usernameRegex.test(updates.username.toLowerCase())) {
          return { error: new Error('Username must be 3-20 characters, lowercase letters, numbers, and underscores only') }
        }

        // Check if username is taken
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', updates.username.toLowerCase())
          .neq('id', user.id)
          .single()

        if (existingUser) {
          return { error: new Error('Username is already taken') }
        }

        updates.username = updates.username.toLowerCase()
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) {
        return { error }
      }

      // Refresh profile
      await refreshProfile()

      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Convenience hook for just the user
export function useUser() {
  const { user, profile, isLoading } = useAuth()
  return { user, profile, isLoading }
}
