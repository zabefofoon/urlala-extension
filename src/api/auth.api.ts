import { SupabaseUser } from '@/models/Auth'
import { apiClient } from './apiClient'

export const authApi = {
	getUser() {
		return apiClient.get<SupabaseUser>('/auth/v1/user')
	}
}
