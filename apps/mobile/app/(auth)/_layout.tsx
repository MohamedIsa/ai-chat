import { useEffect } from 'react'
import { Stack, router } from 'expo-router'
import { supabase } from '@/lib/supabase'

export default function AuthLayout() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/(app)/conversations')
    })
  }, [])

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  )
}
