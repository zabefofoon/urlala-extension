import { authApi } from '@/api/auth.api'
import type { User } from '@supabase/supabase-js'
import dayjs from 'dayjs'
import { foldersStore } from './folders.svelte'
class AuthStore {
	accessToken = $state<string | undefined>()
	refreshToken = $state<string | undefined>()
	user = $state<User | undefined>()
	isLoaded = $state(false)

	get isLoggedIn() {
		return !!this.user?.id
	}

	profileImage = $derived.by(() => {
		return (
			this.user?.user_metadata.custom_avatar_url ??
			this.user?.user_metadata.avatar_url ??
			this.user?.user_metadata.picture
		)
	})

	load = async () => {
		const result = await browser.storage.local.get(['accessToken', 'refreshToken'])
		this.accessToken = result.accessToken as string
		this.refreshToken = result.refreshToken as string
		this.isLoaded = true

		if (this.accessToken) {
			await this.loadUser()
			await foldersStore.migrate()
		}
	}

	loadUser = async () => {
		// 캐시가 유효하면 API 호출 없이 반환
		const cached = await browser.storage.local.get(['user', 'userExpiresAt'])
		const expiresAt = cached.userExpiresAt as string | undefined

		if (expiresAt && dayjs().isBefore(dayjs(expiresAt)) && cached.user)
			this.user = cached.user as User
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

	getValidAccessToken = async (): Promise<string | undefined> => {
		const token = this.accessToken
		if (!token) return undefined

		try {
			const payload = JSON.parse(atob(token.split('.')[1]))
			if (payload.exp * 1000 > Date.now()) return token
		} catch {
			return token
		}

		if (!this.refreshToken) return undefined

		try {
			const { data } = await authApi.refreshTokens(this.refreshToken)

			await browser.storage.local.set({
				accessToken: data.access_token,
				refreshToken: data.refresh_token
			})

			this.accessToken = data.access_token
			this.refreshToken = data.refresh_token

			return data.access_token
		} catch {
			return undefined
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
