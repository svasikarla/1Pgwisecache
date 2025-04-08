import { createClient } from "./supabase/client"
import type { User } from "@supabase/supabase-js"

const supabase = createClient()

export const GUEST_LINK_LIMIT = 10
const GUEST_DOMAIN = "guest.wisecache.com"

export function isGuest(user: User): boolean {
  return user.email?.endsWith(`@${GUEST_DOMAIN}`) ?? false
}

export async function createGuestUser() {
  try {
    // Generate a unique guest email with consistent domain
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const guestEmail = `guest_${timestamp}_${randomSuffix}@${GUEST_DOMAIN}`
    const guestPassword = "guestguest" // Simple password for guest users

    // Sign up the guest user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: guestEmail,
      password: guestPassword,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (signUpError) {
      console.error("Error creating guest user:", signUpError)
      throw signUpError
    }

    if (!authData.user) {
      throw new Error("No user returned after sign up")
    }

    // Create a user record in the public.users table
    const { error: userError } = await supabase
      .from("users")
      .insert([
        {
          id: authData.user.id,
          email: guestEmail,
          is_guest: true,
          created_at: new Date().toISOString(),
        },
      ])

    if (userError) {
      console.error("Error creating user record:", userError)
      // If we fail to create the user record, clean up the auth user
      await supabase.auth.signOut()
      throw userError
    }

    return authData.user
  } catch (error) {
    console.error("Error in createGuestUser:", error)
    throw error
  }
}

export async function getGuestLinkCount(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("knowledge_base")
      .select("id")
      .eq("user_id", userId)

    if (error) throw error
    return data?.length ?? 0
  } catch (error) {
    console.error("Error getting guest link count:", error)
    return 0
  }
}

export async function cleanupGuestUser(userId: string): Promise<void> {
  try {
    // Delete all guest user's links
    const { error: deleteError } = await supabase
      .from("knowledge_base")
      .delete()
      .eq("user_id", userId)

    if (deleteError) throw deleteError

    // Delete the user record from public.users
    const { error: userError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId)

    if (userError) throw userError

    // Sign out the user
    await supabase.auth.signOut()
  } catch (error) {
    console.error("Error cleaning up guest user:", error)
  }
} 