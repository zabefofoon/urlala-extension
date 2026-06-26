import type { User } from '@supabase/supabase-js'
import axios from 'axios'
import { SUPABASE_ANON_KEY, SUPABASE_URL, apiClient } from './apiClient'

export const authApi = {
	getUser() {
		return apiClient.get<User>('/auth/v1/user')
	},

	async refreshTokens(refreshToken: string) {
		return axios.post(
			`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
			{ refresh_token: refreshToken },
			{ headers: { apikey: SUPABASE_ANON_KEY } }
		)
	}
}
