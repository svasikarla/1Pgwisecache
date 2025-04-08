import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)

export type KnowledgeBase = {
  id: number
  category: string
  headline: string
  summary: string
  original_url: string
  created_at: string
  user_id: string
}

export type User = {
  id: string
  email: string
  created_at: string
} 