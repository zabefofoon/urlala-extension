import { apiClient } from '@/lib/apiClient'
import type { SupabaseUser } from '@/lib/supabase'

class AuthStore {
  accessToken = $state<string | null>(null)
  refreshToken = $state<string | null>(null)
  user = $state<SupabaseUser | null>(null)
  isLoaded = $state(false)

  get isLoggedIn() {
    return !!this.accessToken
  }

  load = async () => {
    const result = await browser.storage.local.get(['accessToken', 'refreshToken'])
    this.accessToken = (result.accessToken as string) ?? null
    this.refreshToken = (result.refreshToken as string) ?? null
    this.isLoaded = true

    if (this.accessToken) await this.loadUser()
  }

  loadUser = async () => {
    try {
      const { data } = await apiClient.get<SupabaseUser>('/auth/v1/user')
      this.user = data

      // interceptor가 토큰을 갱신했을 수 있으므로 storage와 동기화
      const result = await browser.storage.local.get(['accessToken', 'refreshToken'])
      this.accessToken = (result.accessToken as string) ?? null
      this.refreshToken = (result.refreshToken as string) ?? null
    } catch {
      this.user = null
    }
  }

  setTokens = async (accessToken: string, refreshToken: string) => {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    await browser.storage.local.set({ accessToken, refreshToken })
  }

  clearTokens = async () => {
    this.accessToken = null
    this.refreshToken = null
    this.user = null
    await browser.storage.local.remove(['accessToken', 'refreshToken'])
  }
}

export const authStore = new AuthStore()
