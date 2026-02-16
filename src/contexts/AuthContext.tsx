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
  
  // Dual-track handicap system (v2.0)
  handicap_seller: number  // 18.0 → 0.0
  handicap_buyer: number   // 18.0 → 0.0
  tier_seller: 'birdie' | 'eagle' | 'albatross' | 'hole_in_one'
  tier_buyer: 'birdie' | 'eagle' | 'albatross' | 'hole_in_one'
  prestige_seller: number  // 0, 1, 2, 3+
  prestige_buyer: number   // 0, 1, 2, 3+
  phone_verified: boolean
  
  // Size preferences
  size_tops: string | null
  size_bottoms_waist: string | null
  size_bottoms_length: string | null
  size_footwear: string | null
  size_headwear: string | null
  size_gloves: string | null
  gender_preference: 'mens' | 'womens' | 'all' | null
  
  created_at: string
}

export interface Address {
  id: string
  user_id: string
  full_name: string
  address_line_1: string
  address_line_2: string | null
  city: string
  state: string
  zip_code: string
  country: string
  phone: string | null
  is_default: boolean
  is_return_address: boolean
  created_at: string
  updated_at: string
}

export interface NotificationPreferences {
  id: string
  push_messages: boolean
  push_sold: boolean
  push_price_drops: boolean
  push_new_items: boolean
  push_order_updates: boolean
  push_drops: boolean
  email_orders: boolean
  email_shipping: boolean
  email_marketing: boolean
  email_digest: boolean
  email_seller_tips: boolean
  created_at: string
  updated_at: string
}

export interface PrivacySettings {
  id: string
  profile_public: boolean
  show_handicap: boolean
  show_sales: boolean
  show_purchases: boolean
  allow_messages_all: boolean
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  addresses: Address[]
  notification_preferences: NotificationPreferences | null
  privacy_settings: PrivacySettings | null
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
  fetchAddresses: () => Promise<void>
  createAddress: (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ error: Error | null; data?: Address }>
  updateAddress: (id: string, updates: Partial<Address>) => Promise<{ error: Error | null }>
  deleteAddress: (id: string) => Promise<{ error: Error | null }>
  fetchNotificationPreferences: () => Promise<void>
  updateNotificationPreferences: (updates: Partial<NotificationPreferences>) => Promise<{ error: Error | null }>
  fetchPrivacySettings: () => Promise<void>
  updatePrivacySettings: (updates: Partial<PrivacySettings>) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [notification_preferences, setNotificationPreferences] = useState<NotificationPreferences | null>(null)
  const [privacy_settings, setPrivacySettings] = useState<PrivacySettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Fetch user profile from database using secure function
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      // Use RPC to bypass RLS issues - calls get_my_profile() function
      const { data, error } = await supabase
        .rpc('get_my_profile')

      if (error) {
        console.error('RPC get_my_profile failed:', error.message)
      }
      
      if (data && data.length > 0) {
        return data[0] as Profile
      }

      // Fallback: direct query if RPC didn't return data
      const { data: directData, error: directError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (directError) {
        console.error('❌ Direct query also failed:', directError.message)
        return null
      }

      console.log('✅ Profile loaded via fallback direct query:', directData)
      return directData as Profile
    } catch (err) {
      console.error('❌ Profile fetch error:', err)
      return null
    }
  }, [supabase])

  // Fetch user's addresses from database
  const fetchAddresses = useCallback(async (userId?: string) => {
    try {
      const targetUser = userId || user
      if (!targetUser) {
        setAddresses([])
        return
      }

      const { data, error } = await supabase.rpc('get_my_addresses')

      if (error) {
        console.error('Error fetching addresses:', error.message)
        setAddresses([])
        return
      }

      setAddresses((data as Address[]) || [])
    } catch (err) {
      console.error('Address fetch error:', err)
      setAddresses([])
    }
  }, [user, supabase])

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
            // Also fetch addresses, notification & privacy preferences when user logs in
            await fetchAddresses()
            await fetchNotificationPreferences()
            await fetchPrivacySettings()
          }, 500)
        } else {
          setProfile(null)
          setAddresses([])
          setNotificationPreferences(null)
          setPrivacySettings(null)
        }

        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          setProfile(null)
          setAddresses([])
          setNotificationPreferences(null)
          setPrivacySettings(null)
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
      // First check if username is taken using public function
      // (avoids RLS issues with direct table access during unauthenticated signup)
      const { data: available, error: checkError } = await supabase
        .rpc('check_username_available', { p_username: username.toLowerCase() })

      if (checkError || !available) {
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
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
        },
      })

      // Log what we're sending for debugging
      console.log('Signup metadata being sent:', {
        username: username.toLowerCase(),
        display_name: displayName || username,
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

  // Create address
  const createAddress = async (
    address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<{ error: Error | null; data?: Address }> => {
    try {
      if (!user) {
        return { error: new Error('Not authenticated') }
      }

      // If this is default, unset other defaults first
      if (address.is_default) {
        const returnAddressFilter = address.is_return_address
          ? supabase.from('addresses').update({ is_default: false }).match({ user_id: user.id, is_return_address: true })
          : supabase.from('addresses').update({ is_default: false }).match({ user_id: user.id, is_return_address: false })
        
        await returnAddressFilter
      }

      const { data, error } = await supabase
        .from('addresses')
        .insert([{ ...address, user_id: user.id }])
        .select()
        .single()

      if (error) {
        return { error }
      }

      await fetchAddresses()
      return { error: null, data: data as Address }
    } catch (err) {
      return { error: err as Error }
    }
  }

  // Update address
  const updateAddress = async (id: string, updates: Partial<Address>): Promise<{ error: Error | null }> => {
    try {
      if (!user) {
        return { error: new Error('Not authenticated') }
      }

      // If setting as default, unset other defaults first
      if (updates.is_default) {
        const addressToUpdate = addresses.find(a => a.id === id)
        if (addressToUpdate) {
          await supabase
            .from('addresses')
            .update({ is_default: false })
            .match({
              user_id: user.id,
              is_return_address: addressToUpdate.is_return_address,
              id: { neq: id }, // Not this address
            })
        }
      }

      const { error } = await supabase
        .from('addresses')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        return { error }
      }

      await fetchAddresses()
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  // Delete address
  const deleteAddress = async (id: string): Promise<{ error: Error | null }> => {
    try {
      if (!user) {
        return { error: new Error('Not authenticated') }
      }

      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        return { error }
      }

      await fetchAddresses()
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  // Fetch notification preferences
  const fetchNotificationPreferences = useCallback(async () => {
    try {
      if (!user) {
        setNotificationPreferences(null)
        return
      }

      const { data, error } = await supabase.rpc('get_my_notification_preferences')

      if (error) {
        console.error('Error fetching notification preferences:', error.message)
        setNotificationPreferences(null)
        return
      }

      if (data && data.length > 0) {
        setNotificationPreferences(data[0] as NotificationPreferences)
      }
    } catch (err) {
      console.error('Notification preferences fetch error:', err)
      setNotificationPreferences(null)
    }
  }, [user, supabase])

  // Update notification preferences
  const updateNotificationPreferences = async (
    updates: Partial<NotificationPreferences>
  ): Promise<{ error: Error | null }> => {
    try {
      if (!user) {
        return { error: new Error('Not authenticated') }
      }

      const { error } = await supabase
        .from('notification_preferences')
        .update(updates)
        .eq('user_id', user.id)

      if (error) {
        return { error }
      }

      await fetchNotificationPreferences()
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  // Fetch privacy settings
  const fetchPrivacySettings = useCallback(async () => {
    try {
      if (!user) {
        setPrivacySettings(null)
        return
      }

      const { data, error } = await supabase.rpc('get_my_privacy_settings')

      if (error) {
        console.error('Error fetching privacy settings:', error.message)
        setPrivacySettings(null)
        return
      }

      if (data && data.length > 0) {
        setPrivacySettings(data[0] as PrivacySettings)
      }
    } catch (err) {
      console.error('Privacy settings fetch error:', err)
      setPrivacySettings(null)
    }
  }, [user, supabase])

  // Update privacy settings
  const updatePrivacySettings = async (
    updates: Partial<PrivacySettings>
  ): Promise<{ error: Error | null }> => {
    try {
      if (!user) {
        return { error: new Error('Not authenticated') }
      }

      const { error } = await supabase
        .from('privacy_settings')
        .update(updates)
        .eq('user_id', user.id)

      if (error) {
        return { error }
      }

      await fetchPrivacySettings()
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    addresses,
    notification_preferences,
    privacy_settings,
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
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    fetchNotificationPreferences,
    updateNotificationPreferences,
    fetchPrivacySettings,
    updatePrivacySettings,
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
