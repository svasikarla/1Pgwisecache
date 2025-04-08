import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import type { Database } from '@/types/supabase'

export async function createClient(cookieStore?: ReadonlyRequestCookies) {
  const store = cookieStore || await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = store.get(name)
          return cookie?.value
        },
        set(name: string, value: string, options: any) {
          try {
            store.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie errors
          }
        },
        remove(name: string, options: any) {
          try {
            store.delete({ name, ...options })
          } catch (error) {
            // Handle cookie errors
          }
        },
      },
    }
  )
}