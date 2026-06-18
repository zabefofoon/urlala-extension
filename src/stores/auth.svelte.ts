import { authApi } from '@/api/auth.api'
import type { SupabaseUser } from '@/models/Auth'
import dayjs from 'dayjs'

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
		// 캐시가 유효하면 API 호출 없이 반환
		const cached = await browser.storage.local.get(['user', 'userExpiresAt'])
		const expiresAt = cached.userExpiresAt as string | undefined

		if (expiresAt && dayjs().isBefore(dayjs(expiresAt)) && cached.user)
			this.user = cached.user as SupabaseUser
		else {
			// 캐시 만료 — API 호출 후 저장
			try {
				const { data } = await authApi.getUser()
				this.user = data
				await browser.storage.local.set({
					user: data,
					userExpiresAt: dayjs().add(60, 'minute').toISOString()
				})

				// interceptor가 토큰을 갱신했을 수 있으므로 storage와 동기화
				const tokens = await browser.storage.local.get(['accessToken', 'refreshToken'])
				this.accessToken = tokens.accessToken as string
				this.refreshToken = tokens.refreshToken as string
			} catch {
				this.user = undefined
			}
		}
	}

	clearTokens = async () => {
		this.accessToken = undefined
		this.refreshToken = undefined
		this.user = undefined
		await browser.storage.local.remove(['accessToken', 'refreshToken', 'user', 'userExpiresAt'])
	}
}

export const authStore = new AuthStore()
