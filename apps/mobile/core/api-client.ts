import * as SecureStore from 'expo-secure-store'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL ?? ''

export class APIClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'APIClientError'
  }
}

export async function setTokens({
  accessToken,
  refreshToken,
  sessionId,
}: {
  accessToken: string
  refreshToken: string
  sessionId?: string
}) {
  await Promise.all([
    SecureStore.setItemAsync('access_token', accessToken),
    SecureStore.setItemAsync('refresh_token', refreshToken),
    sessionId ? SecureStore.setItemAsync('session_id', sessionId) : Promise.resolve(),
  ])
}

export async function clearTokens() {
  await Promise.all([
    SecureStore.deleteItemAsync('access_token'),
    SecureStore.deleteItemAsync('refresh_token'),
    SecureStore.deleteItemAsync('session_id'),
  ])
}

export async function refreshSession() {
  const refreshToken = await SecureStore.getItemAsync('refresh_token')
  if (!refreshToken) throw new APIClientError('No refresh token stored', 401)

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  if (!res.ok) {
    await clearTokens()
    throw new APIClientError('Session refresh failed', res.status)
  }

  const data = (await res.json()) as { access_token: string; refresh_token: string }
  await setTokens({ accessToken: data.access_token, refreshToken: data.refresh_token })
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const accessToken = await SecureStore.getItemAsync('access_token')

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let message = res.statusText
    try {
      const err = (await res.json()) as { message?: string; error?: string }
      message = err.message ?? err.error ?? message
    } catch {
      // non-JSON error body
    }
    throw new APIClientError(message, res.status)
  }

  return res.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
