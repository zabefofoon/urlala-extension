export type SupabaseUser = {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    avatar_url?: string
    email?: string
  }
}
