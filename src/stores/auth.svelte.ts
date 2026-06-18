import { authApi } from '@/api/auth.api'
import { SupabaseUser } from '@/models/Auth'

class AuthStore {
	accessToken = $state<string | undefined>()
	refreshToken = $state<string | undefined>()
	user = $state<SupabaseUser | undefined>()
	isLoaded = $state(false)

	get isLoggedIn() {
		return !!this.accessToken
	}

	load = async () => {
		const result = await browser.storage.local.get(['accessToken', 'refreshToken'])
		this.accessToken = result.accessToken as string
		this.refreshToken = result.refreshToken as string
		this.isLoaded = true

		if (this.accessToken) await this.loadUser()
	}

	loadUser = async () => {
		try {
			const { data } = await authApi.getUser()
			this.user = data

			// interceptor가 토큰을 갱신했을 수 있으므로 storage와 동기화
			const result = await browser.storage.local.get(['accessToken', 'refreshToken'])
			this.accessToken = result.accessToken as string
			this.refreshToken = result.refreshToken as string
		} catch {
			this.user = undefined
		}
	}

	setTokens = async (accessToken: string, refreshToken: string) => {
		this.accessToken = accessToken
		this.refreshToken = refreshToken
		await browser.storage.local.set({ accessToken, refreshToken })
	}

	clearTokens = async () => {
		this.accessToken = undefined
		this.refreshToken = undefined
		this.user = undefined
		await browser.storage.local.remove(['accessToken', 'refreshToken'])
	}
}

export const authStore = new AuthStore()
