import { createContext, useContext } from 'react'
import type { Session } from '@supabase/supabase-js'

interface AuthContextValue {
  session: Session | null
}

export const AuthContext = createContext<AuthContextValue>({ session: null })

export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
