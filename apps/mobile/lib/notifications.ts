import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { apiClient } from '@/core/api-client'

export const PUSH_AVAILABLE =
  Platform.OS !== 'web' && Constants.appOwnership !== 'expo'

export async function setupAndroidChannel() {
  if (Platform.OS !== 'android') return
  try {
    const Notifications = await import('expo-notifications')
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
    })
  } catch {
    // expo-notifications unavailable in Expo Go
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const Notifications = await import('expo-notifications')
    const { status: existing } = await Notifications.getPermissionsAsync()
    if (existing === 'granted') return true
    const { status } = await Notifications.requestPermissionsAsync()
    return status === 'granted'
  } catch {
    return false
  }
}

export async function getExpoPushToken(): Promise<string | null> {
  try {
    const Notifications = await import('expo-notifications')
    const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined
    if (!projectId) return null
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId })
    return data
  } catch {
    return null
  }
}

export async function registerPushTokenWithServer(token: string) {
  try {
    await apiClient.post('/notifications/register', { token, platform: Platform.OS })
  } catch {
    // best-effort
  }
}

export async function deregisterPushTokenWithServer() {
  try {
    const token = await getExpoPushToken()
    if (token) await apiClient.post('/notifications/deregister', { token })
  } catch {
    // best-effort
  }
}
