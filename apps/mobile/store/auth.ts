import { create } from 'zustand'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export type { User }

interface AuthStore {
  isLoading: boolean
  isAuthenticated: boolean
  user: User | null
  _initialize: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoading: true,
  isAuthenticated: false,
  user: null,

  _initialize: async () => {
    const { data } = await supabase.auth.getSession()
    set({
      isLoading: false,
      isAuthenticated: !!data.session,
      user: data.session?.user ?? null,
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        isLoading: false,
        isAuthenticated: !!session,
        user: session?.user ?? null,
      })
    })
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ isLoading: false, isAuthenticated: false, user: null })
    router.replace('/(auth)/login')
  },
}))
