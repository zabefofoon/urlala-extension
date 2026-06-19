import axios from 'axios'

const SUPABASE_URL = 'https://qanwlpeiztsrizmrzahr.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_reAV_hd_IW8MdXUpVIvR1g_34mB-hKB'

export const apiClient = axios.create({
	baseURL: SUPABASE_URL,
	headers: { apikey: SUPABASE_ANON_KEY }
})

// 요청마다 storage에서 토큰을 읽어 Authorization 헤더에 주입
apiClient.interceptors.request.use(async (config) => {
	const { accessToken } = await browser.storage.local.get('accessToken')
	if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`

	return config
})

// 401 응답 시 refresh 후 원래 요청 재시도
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config

		const status = error.response?.status
		const isBadJwt = error.response?.data?.error_code === 'bad_jwt'
		const shouldRetry = status === 401 || (status === 403 && isBadJwt)
		if (!shouldRetry || originalRequest._retry) {
			return Promise.reject(error)
		}

		originalRequest._retry = true

		const { refreshToken } = await browser.storage.local.get('refreshToken')
		if (!refreshToken) return Promise.reject(error)

		// apiClient를 쓰면 interceptor가 다시 타므로 axios 직접 호출
		const { data } = await axios.post(
			`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
			{ refresh_token: refreshToken },
			{ headers: { apikey: SUPABASE_ANON_KEY } }
		)

		await browser.storage.local.set({
			accessToken: data.access_token,
			refreshToken: data.refresh_token
		})

		originalRequest.headers.Authorization = `Bearer ${data.access_token}`
		return apiClient(originalRequest)
	}
)
